import { iconNode } from 'discourse-common/lib/icon-library';
import DiscourseURL from 'discourse/lib/url';
import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';

createWidget('custom-header-dropdown', {
  tagName: 'li.custom-header-dropdown-link',
  buildKey: (attrs) => `custom-header-dropdown-${attrs.title}`,

  html(attrs) {
    const icon = attrs.icon ? iconNode(attrs.icon) : null;
    const iconHTML = icon ? h('span.custom-header-link-icon', icon) : '';
    const titleHTML = h('span.custom-header-link-title', attrs.title);
    const descHTML = attrs.description
      ? h('span.custom-header-link-desc', attrs.description)
      : '';
    const contents = [iconHTML, titleHTML, descHTML];
    return contents;
  },

  click() {
    DiscourseURL.routeTo(this.attrs.url);
  },
});
