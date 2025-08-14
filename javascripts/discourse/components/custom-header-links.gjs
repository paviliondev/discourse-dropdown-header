import { tracked } from "@glimmer/tracking";
import Component from "@ember/component";
import { hash } from "@ember/helper";
import { action } from "@ember/object";
import { service } from "@ember/service";
import DButton from "discourse/components/d-button";
import concatClass from "discourse/helpers/concat-class";
import closeOnClickOutside from "discourse/modifiers/close-on-click-outside";
import { i18n } from "discourse-i18n";
import CustomHeaderLink from "./custom-header-link";

export default class CustomHeaderLinks extends Component {
  @service siteSettings;
  @service site;

  @tracked showLinks = !this.site.mobileView;

  @action
  toggleHeaderLinks() {
    this.showLinks = !this.showLinks;

    if (this.showLinks) {
      document.body.classList.add("dropdown-header-open");
    } else {
      document.body.classList.remove("dropdown-header-open");
    }
  }

  get headerLinks() {
    return JSON.parse(settings.header_links);
  }

  <template>
    <nav
      class={{concatClass
        "custom-header-links"
        (if @outletArgs.minimized "scrolling")
      }}
    >
      {{#if this.site.mobileView}}
        <span class="btn-custom-header-dropdown-mobile">
          <DButton
            @icon="square-caret-down"
            @title={{i18n "custom_header.discord"}}
            @action={{this.toggleHeaderLinks}}
          />
        </span>
      {{/if}}

      {{#if this.showLinks}}
        <ul
          class="top-level-links"
          {{(if
            this.site.mobileView
            (modifier
              closeOnClickOutside
              this.toggleHeaderLinks
              (hash target=this.element)
            )
          )}}
        >
          {{#each this.headerLinks as |item|}}
            <CustomHeaderLink
              @item={{item}}
              @toggleHeaderLinks={{this.toggleHeaderLinks}}
            />
          {{/each}}
        </ul>
      {{/if}}
    </nav>
  </template>
}
