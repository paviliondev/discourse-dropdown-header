import DiscourseURL from 'discourse/lib/url';
import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import buildIconHTML from '../lib/icon-builder';

createWidget('custom-header-dropdown', {
  tagName: 'li.custom-header-dropdown-link',
  buildKey: (attrs) => `custom-header-dropdown-${attrs.title}`,

  buildAttributes(attrs) {
    return {
      title: attrs.title,
    };
  },

  html(attrs) {
    const iconHTML = buildIconHTML(attrs.icon);
    const titleHTML = h('span.custom-header-link-title', attrs.title);
    const descHTML = attrs.description
      ? h('span.custom-header-link-desc', attrs.description)
      : '';
    const contents = [iconHTML, titleHTML, descHTML];
    return contents;
  },

  click() {
    if (this.site.mobileView) {
      this.sendWidgetAction("toggleDropdown"); // in mobile view, close menu on click
    }
    DiscourseURL.routeTo(this.attrs.url);
  },
});
