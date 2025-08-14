import Component from "@ember/component";
import { equal } from "@ember/object/computed";
import { tagName } from "@ember-decorators/component";
import concatClass from "discourse/helpers/concat-class";
import dIcon from "discourse/helpers/d-icon";

@tagName("")
export default class CustomIcon extends Component {
  @equal("sourceType", "image_url") isImageUrl;
  @equal("sourceType", "font_awesome") isFontAwesome;

  get sourceType() {
    return settings.icon_source;
  }

  get source() {
    return this.icon?.trim();
  }

  <template>
    {{#if this.source}}
      <span class={{concatClass "custom-header-link-icon" @class}}>
        {{#if this.isImageUrl}}
          <img src={{this.source}} />
        {{else if this.isFontAwesome}}
          {{dIcon this.source}}
        {{/if}}
      </span>
    {{/if}}
  </template>
}
