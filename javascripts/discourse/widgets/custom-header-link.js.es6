import { iconNode } from "discourse-common/lib/icon-library";
import { withPluginApi } from "discourse/lib/plugin-api";
import DiscourseURL from "discourse/lib/url";
import { createWidget } from "discourse/widgets/widget";
import { h } from "virtual-dom";
import buildIconHTML from "../lib/icon-builder";

createWidget("custom-header-link", {
  tagName: "li.custom-header-link",
  buildKey: (attrs) => `custom-header-link-${attrs.id}`,

  html(attrs) {
    const iconHTML = buildIconHTML(attrs.icon);
    const titleHTML = h("span.custom-header-link-title", attrs.title);
    const permissions = this.handleLinkPermissions(attrs);
    const allDropdownItems = settings.dropdown_links
      ? JSON.parse(settings.dropdown_links)
      : [];
    const dropdownLinks = allDropdownItems.filter(
      (d) => d.headerLinkId === attrs.id
    );

    if (!permissions) {
      return;
    }

    const dropdownItems = [];

    dropdownLinks.forEach((link) => {
      dropdownItems.push(this.attach("custom-header-dropdown", link));
    });

    const hasDropdown = dropdownItems.length > 0 ? true : false;

    const dropdownHTML = hasDropdown
      ? h("ul.custom-header-dropdown", dropdownItems)
      : "";

    const contents = [
      iconHTML,
      titleHTML,
      this.caretHTML(hasDropdown),
      dropdownHTML,
    ];
    return contents;
  },

  buildAttributes(attrs) {
    return {
      title: attrs.title,
    };
  },

  buildClasses(attrs) {
    const classes = [];

    if (attrs.url) {
      classes.push("with-url");
    }

    if (attrs.hasDropdown) {
      classes.push("has-dropdown");
    }

    return classes;
  },

  handleLinkPermissions(attrs) {
    if (!settings.security) {
      return true;
    }

    const permissions = JSON.parse(settings.security);
    const getPermissions = permissions
      .filter((p) => p.headerLinkId === attrs.id)
      .map((p) => p.title);

    const currentUser = withPluginApi("1.2.0", (api) => {
      return api.getCurrentUser();
    });

    const currentUserGroups = currentUser?.groups.map((g) => g.name);

    if (getPermissions?.length < 1) {
      return true;
    }

    if (getPermissions.length < 0) {
      return false;
    }

    if (!currentUser) {
      return false;
    }

    if (currentUserGroups.includes(getPermissions[0])) {
      return true;
    }

    return false;
  },

  caretHTML(hasDropdown) {
    if (!settings.show_caret_icons || !hasDropdown) {
      return;
    }

    return h("span.custom-header-link-caret", iconNode("caret-down"));
  },

  click() {
    DiscourseURL.routeTo(this.attrs.url);
  },
});
