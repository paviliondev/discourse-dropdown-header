import { click, currentURL, visit } from "@ember/test-helpers";
import { test } from "qunit";
import sinon from "sinon";
import {
  acceptance,
  query,
  queryAll,
  visible,
} from "discourse/tests/helpers/qunit-helpers";

const headerLinksSettingFixtures = [
  { id: 0, title: "Plugins", icon: "plug" },
  { id: 1, title: "Faq", icon: "globe", url: "/faq" },
  { id: 2, title: "Tos", icon: "", url: "/tos" },
  { id: 3, title: "Privacy", icon: "images.png", url: "/privacy" },
  { id: 4, title: "Topics", icon: "", url: "/latest", newTab: true },
];

const dropdownLinksSettingFixtures = [
  {
    headerLinkId: 0,
    title: "Chat",
    icon: "d-chat",
    url: "/chat",
    description: "Discussion",
  },
  {
    headerLinkId: 0,
    title: "Poll",
    icon: "",
    url: "/categories",
    description: "",
  },
  { headerLinkId: 1, title: "Help", icon: "", url: "/about", description: "" },
  {
    headerLinkId: 4,
    title: "Top",
    icon: "",
    url: "/top",
    description: "",
    newTab: true,
  },
];

const securitySettingFixture = [{ headerLinkId: 0, title: "staff" }];

acceptance("Dropdown header - Default", function (needs) {
  needs.hooks.beforeEach(() => {
    settings.header_links = JSON.stringify(headerLinksSettingFixtures);
    settings.dropdown_links = JSON.stringify(dropdownLinksSettingFixtures);
  });

  needs.hooks.afterEach(() => {
    settings.header_links = "[]";
    settings.dropdown_links = "[]";
  });

  test("it renders the headers links", async function (assert) {
    await visit("/");

    assert.ok(
      visible(".custom-header-links"),
      "The header links wrapper is rendered"
    );

    const linksElements = queryAll(".custom-header-link");

    assert.equal(
      linksElements.length,
      headerLinksSettingFixtures.length,
      "The header links are rendered"
    );

    const linkElement = linksElements[0];
    const fixtures = headerLinksSettingFixtures[0];

    const iconElement = linkElement.querySelector(".custom-header-link-icon");
    assert.notStrictEqual(iconElement, null, `The icon wrapper is rendered`);
    assert.ok(
      iconElement
        .querySelector("svg")
        ?.classList.contains(`d-icon-${fixtures.icon}`),
      `The icon is rendered`
    );

    const titleElement = linkElement.querySelector(".custom-header-link-title");
    assert.notStrictEqual(titleElement, null, `The title wrapper is rendered`);
    assert.strictEqual(
      titleElement.textContent.trim(),
      fixtures.title,
      `The title is rendered`
    );
  });

  test("it renders the dropdown links", async function (assert) {
    await visit("/");

    const dropdownElement = queryAll(".custom-header-link")[0].querySelector(
      ".custom-header-dropdown"
    );
    assert.notStrictEqual(
      dropdownElement,
      null,
      `The dropdown wrapper is rendered`
    );

    const dropdownLinksElements = dropdownElement.querySelectorAll(
      ".custom-header-dropdown-link"
    );

    assert.equal(
      dropdownLinksElements.length,
      dropdownLinksSettingFixtures.filter(
        (setting) => setting.headerLinkId === 0
      ).length,
      "The dropdown links are rendered"
    );
    const fixtures = dropdownLinksSettingFixtures[0];
    const dropdownLinkElement = dropdownLinksElements[0];
    const dropdownIconElement = dropdownLinkElement.querySelector(
      ".custom-header-link-icon"
    );
    assert.notStrictEqual(
      dropdownIconElement,
      null,
      `The dropdown icon wrapper is rendered`
    );
    assert.ok(
      dropdownIconElement
        .querySelector("svg")
        ?.classList.contains(`d-icon-${fixtures.icon}`),
      `The dropdown icon is rendered`
    );

    const dropdownTitleElement = dropdownLinkElement.querySelector(
      ".custom-header-link-title"
    );
    assert.notStrictEqual(
      dropdownTitleElement,
      null,
      `The dropdown title wrapper is rendered`
    );
    assert.strictEqual(
      dropdownTitleElement.textContent.trim(),
      fixtures.title,
      `The dropdown title is rendered`
    );

    const dropdownDescElement = dropdownLinkElement.querySelector(
      ".custom-header-link-desc"
    );
    assert.notStrictEqual(
      dropdownDescElement,
      null,
      `The dropdown description wrapper is rendered`
    );
    assert.strictEqual(
      dropdownDescElement.textContent.trim(),
      fixtures.description,
      `The dropdown description is rendered`
    );
  });

  test("it doesn't render with empty setting", async function (assert) {
    await visit("/");

    let linkElement = queryAll(".custom-header-link")[2];

    assert.notOk(
      linkElement.querySelector("custom-header-link-icon"),
      "The header links wrapper is not rendered"
    );

    assert.notOk(
      linkElement.querySelector("custom-header-dropdown"),
      "The dropdown wrapper is not rendered"
    );

    const dropdownElement = queryAll(".custom-header-link")[0].querySelector(
      ".custom-header-dropdown"
    );
    linkElement = dropdownElement.querySelectorAll(
      ".custom-header-dropdown-link"
    )[1];

    assert.notOk(
      linkElement.querySelector("custom-header-link-icon"),
      "The dropdown icon wrapper is not rendered"
    );
    assert.notOk(
      linkElement.querySelector("custom-header-link-desc"),
      "The dropdown description wrapper is not rendered"
    );
  });
});

acceptance("Dropdown header - Image URL as icon source", function (needs) {
  needs.hooks.beforeEach(() => {
    settings.header_links = JSON.stringify(headerLinksSettingFixtures);
    settings.dropdown_links = JSON.stringify(dropdownLinksSettingFixtures);
    settings.icon_source = "image_url";
  });

  needs.hooks.afterEach(() => {
    settings.header_links = "[]";
    settings.dropdown_links = "[]";
  });

  test("it renders the <img> tag", async function (assert) {
    await visit("/");

    const linksElements = queryAll(".custom-header-link");
    const linkElement = linksElements[3];
    const fixtures = headerLinksSettingFixtures[3];

    const iconElement = linkElement.querySelector(".custom-header-link-icon");
    assert.notStrictEqual(iconElement, null, `The icon wrapper is rendered`);
    assert.ok(
      iconElement.querySelector("img")?.src.includes(fixtures.icon),
      `The icon is rendered`
    );
  });
});

acceptance("Dropdown header - Caret icon", function (needs) {
  needs.hooks.beforeEach(() => {
    settings.header_links = JSON.stringify(headerLinksSettingFixtures);
    settings.dropdown_links = JSON.stringify(dropdownLinksSettingFixtures);
  });

  needs.hooks.afterEach(() => {
    settings.header_links = "[]";
    settings.dropdown_links = "[]";
  });

  test("it does render the caret icon", async function (assert) {
    settings.show_caret_icons = true;

    await visit("/");

    const linksElements = queryAll(".custom-header-link");
    const caretElement = linksElements[0].querySelector(
      ".custom-header-link-caret"
    );

    assert.notStrictEqual(caretElement, null, `The caret wrapper is rendered`);
    assert.ok(
      caretElement
        ?.querySelector("svg")
        ?.classList.contains("d-icon-caret-down"),
      `The icon is rendered`
    );
  });

  test("it doesn't render the caret icon", async function (assert) {
    settings.show_caret_icons = false;

    await visit("/");

    const linksElements = queryAll(".custom-header-link");
    const caretElement = linksElements[0].querySelector(
      ".custom-header-link-caret"
    );

    assert.strictEqual(caretElement, null, `The caret wrapper is not rendered`);
    assert.notOk(
      caretElement
        ?.querySelector("svg")
        ?.classList.contains("d-icon-caret-down"),
      `The icon is not rendered`
    );
  });
});

acceptance("Dropdown header - Security - Anonymous", function (needs) {
  needs.hooks.beforeEach(() => {
    settings.header_links = JSON.stringify(headerLinksSettingFixtures);
    settings.dropdown_links = JSON.stringify(dropdownLinksSettingFixtures);
    settings.security = JSON.stringify(securitySettingFixture);
  });

  needs.hooks.afterEach(() => {
    settings.header_links = "[]";
    settings.dropdown_links = "[]";
    settings.security = "[]";
  });

  test("it doesn't render the dropdown links if the user is not logged in", async function (assert) {
    await visit("/");

    const linksElements = queryAll(".custom-header-link");

    assert.equal(
      linksElements.length,
      headerLinksSettingFixtures.length - 1,
      "The header links are rendered with security filter"
    );

    const linkElement = linksElements[0];
    const title = linkElement.getAttribute("title");

    assert.notEqual(
      title,
      headerLinksSettingFixtures[0].title,
      `The link is correctly filtered`
    );
  });
});

acceptance(
  "Dropdown header - Security - Valid group - Logged in",
  function (needs) {
    needs.hooks.beforeEach(() => {
      settings.header_links = JSON.stringify(headerLinksSettingFixtures);
      settings.dropdown_links = JSON.stringify(dropdownLinksSettingFixtures);
      settings.security = JSON.stringify(securitySettingFixture);
    });

    needs.hooks.afterEach(() => {
      settings.header_links = "[]";
      settings.dropdown_links = "[]";
      settings.security = "[]";
    });

    needs.user();

    test("it renders the dropdown links if the user is in the group", async function (assert) {
      await visit("/");

      const linksElements = queryAll(".custom-header-link");

      assert.equal(
        linksElements.length,
        headerLinksSettingFixtures.length,
        "The header links are rendered with security filter"
      );

      const linkElement = linksElements[0];
      const title = linkElement.getAttribute("title");

      assert.equal(
        title,
        headerLinksSettingFixtures[0].title,
        `The link is correctly filtered`
      );
    });
  }
);

acceptance(
  "Dropdown header - Security - Invalid group - Logged in",
  function (needs) {
    needs.hooks.beforeEach(() => {
      settings.header_links = JSON.stringify(headerLinksSettingFixtures);
      settings.dropdown_links = JSON.stringify(dropdownLinksSettingFixtures);
      settings.security = JSON.stringify(securitySettingFixture);
    });

    needs.hooks.afterEach(() => {
      settings.header_links = "[]";
      settings.dropdown_links = "[]";
      settings.security = "[]";
    });

    needs.user({
      groups: [{ name: "custom_group" }],
    });

    test("it doesn't render the dropdown links if the user is not in the group", async function (assert) {
      await visit("/");

      const linksElements = queryAll(".custom-header-link");

      assert.equal(
        linksElements.length,
        headerLinksSettingFixtures.length - 1,
        "The header links are rendered with security filter"
      );

      const linkElement = linksElements[0];
      const title = linkElement.getAttribute("title");

      assert.notEqual(
        title,
        headerLinksSettingFixtures[0].title,
        `The link is correctly filtered`
      );
    });
  }
);

acceptance("Dropdown header - Redirect to URL", function (needs) {
  needs.hooks.beforeEach(() => {
    settings.header_links = JSON.stringify(headerLinksSettingFixtures);
    settings.dropdown_links = JSON.stringify(dropdownLinksSettingFixtures);
  });

  needs.hooks.afterEach(() => {
    settings.header_links = "[]";
    settings.dropdown_links = "[]";
  });

  test("it redirects to the correct URL - Header links", async function (assert) {
    await visit("/");

    const linksElements = queryAll(".custom-header-link");
    const linkElement = linksElements[1];
    const fixtures = headerLinksSettingFixtures[1];

    await click(linkElement);

    assert.strictEqual(
      currentURL(),
      fixtures.url,
      `The header link redirects to the correct URL`
    );
  });

  test("it redirects to the correct URL - Dropdown links", async function (assert) {
    await visit("/");

    const linksElements = queryAll(".custom-header-link");
    const linkElement = linksElements[0];
    const fixtures = dropdownLinksSettingFixtures[1];

    const dropdownElement = linkElement.querySelector(
      ".custom-header-dropdown"
    );
    const dropdownLinksElements = dropdownElement.querySelectorAll(
      ".custom-header-dropdown-link"
    );

    const dropdownLinkElement = dropdownLinksElements[1];

    await click(dropdownLinkElement);

    assert.strictEqual(
      currentURL(),
      fixtures.url,
      `The dropdown link redirects to the correct URL`
    );
  });

  test("it redirects to the correct URL - Dropdown links with header link", async function (assert) {
    await visit("/");

    const linksElements = queryAll(".custom-header-link");
    const linkElement = linksElements[1];
    const fixtures = dropdownLinksSettingFixtures[2];

    const dropdownElement = linkElement.querySelector(
      ".custom-header-dropdown"
    );
    const dropdownLinksElements = dropdownElement.querySelectorAll(
      ".custom-header-dropdown-link"
    );

    const dropdownLinkElement = dropdownLinksElements[0];

    await click(dropdownLinkElement);

    assert.strictEqual(
      currentURL(),
      fixtures.url,
      `The dropdown link redirects to the correct URL`
    );
  });

  test("it opens URL in new tab if newTab is true", async function (assert) {
    const openStub = sinon.stub(window, "open").returns(null);

    await visit("/");

    const linksElements = queryAll(".custom-header-link");

    await click(linksElements[4]);

    assert.true(
      openStub.calledWith(headerLinksSettingFixtures[4].url, "_blank"),
      "The dropdown link opens in a new tab"
    );

    const dropdownElement = linksElements[4].querySelector(
      ".custom-header-dropdown"
    );
    const dropdownLinksElements = dropdownElement.querySelectorAll(
      ".custom-header-dropdown-link"
    );

    await click(dropdownLinksElements[0]);

    assert.true(
      openStub.calledWith(dropdownLinksSettingFixtures[3].url, "_blank"),
      "The dropdown link opens in a new tab"
    );
  });
});

acceptance("Dropdown header - Mobile view", function (needs) {
  needs.mobileView();

  needs.hooks.beforeEach(() => {
    settings.header_links = JSON.stringify(headerLinksSettingFixtures);
    settings.dropdown_links = JSON.stringify(dropdownLinksSettingFixtures);
  });

  needs.hooks.afterEach(() => {
    settings.header_links = "[]";
    settings.dropdown_links = "[]";
  });

  test("it toggles the header dropdown on click", async function (assert) {
    await visit("/");

    const headerLinkElement = query(".custom-header-links button");
    await click(headerLinkElement);

    assert.ok(
      visible(".top-level-links"),
      "The top header dropdown is visible"
    );

    const linksElements = queryAll(".custom-header-link");
    const linkElement = linksElements[0];

    assert.ok(
      linkElement.classList.contains("is-open"),
      "The header dropdown is visible initially"
    );

    await click(linkElement);

    assert.notOk(
      linkElement.classList.contains("is-open"),
      "The header dropdown is hidden after click"
    );
  });

  test("it doesn't render the caret icon on header link with URL defined", async function (assert) {
    await visit("/");

    const headerLinkElement = query(".custom-header-links button");
    await click(headerLinkElement);

    const linksElements = queryAll(".custom-header-link");
    const caretElement = linksElements[1].querySelector(
      ".custom-header-link-caret"
    );

    assert.strictEqual(caretElement, null, `The caret wrapper is not rendered`);
    assert.notOk(
      caretElement
        ?.querySelector("svg")
        ?.classList.contains("d-icon-caret-down"),
      `The icon is not rendered`
    );
  });
});
