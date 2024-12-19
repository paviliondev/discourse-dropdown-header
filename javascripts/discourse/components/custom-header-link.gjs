import Component from "@ember/component";
import { fn } from "@ember/helper";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { notEmpty } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import concatClass from "discourse/helpers/concat-class";
import DiscourseURL from "discourse/lib/url";
import dIcon from "discourse-common/helpers/d-icon";
import CustomIcon from "./custom-icon";

export default class CustomHeaderLink extends Component {
  @service siteSettings;
  @service site;
  @service currentUser;

  @notEmpty("dropdownLinks") hasDropdown;

  get shouldDisplay() {
    if (!settings.security) {
      return true;
    }

    const permissions = JSON.parse(settings.security);
    const getPermissions = permissions
      .filter((p) => p.headerLinkId === this.item.id)
      .map((p) => p.title);

    const currentUserGroups = this.currentUser?.groups.map((g) => g.name);

    if (getPermissions?.length < 1) {
      return true;
    }

    if (getPermissions.length < 0) {
      return false;
    }

    if (!this.currentUser) {
      return false;
    }

    if (currentUserGroups.includes(getPermissions[0])) {
      return true;
    }

    return false;
  }

  get showCaret() {
    return settings.show_caret_icons && this.hasDropdown;
  }

  get dropdownLinks() {
    const allDropdownItems = settings.dropdown_links
      ? JSON.parse(settings.dropdown_links)
      : [];

    const dropdownLinks = allDropdownItems.filter(
      (d) => d.headerLinkId === this.item.id
    );

    return dropdownLinks;
  }

  @action
  redirectToUrl(item) {
    if (this.site.mobileView) {
      this.toggleHeaderLinks();
    }

    if (item.newTab) {
      window.open(item.url, "_blank");
    } else {
      DiscourseURL.routeTo(item.url);
    }

    event.stopPropagation();
  }

  <template>
    {{#if this.shouldDisplay}}
      <li
        class={{concatClass
          "custom-header-link"
          (if @item.url "with-url")
          (if this.hasDropdown "has-dropdown")
        }}
        title={{@item.title}}
        {{(if @item.url (modifier on "click" (fn this.redirectToUrl @item)))}}
      >
        <CustomIcon @icon={{@item.icon}} />
        <span class="custom-header-link-title">{{@item.title}}</span>

        {{#if this.showCaret}}
          <span class="custom-header-link-caret">
            {{dIcon "caret-down"}}
          </span>
        {{/if}}

        {{#if this.hasDropdown}}
          <ul class="custom-header-dropdown">
            {{#each this.dropdownLinks as |dropdownItem|}}
              <li
                class="custom-header-dropdown-link"
                title={{dropdownItem.title}}
                role="button"
                {{on "click" (fn this.redirectToUrl dropdownItem)}}
              >
                <CustomIcon @icon={{dropdownItem.icon}} />
                <span
                  class="custom-header-link-title"
                >{{dropdownItem.title}}</span>
                {{#if dropdownItem.description}}
                  <span
                    class="custom-header-link-desc"
                  >{{dropdownItem.description}}</span>
                {{/if}}
              </li>
            {{/each}}
          </ul>
        {{/if}}
      </li>
    {{/if}}
  </template>
}
