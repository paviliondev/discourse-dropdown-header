import hbs from 'discourse/widgets/hbs-compiler';
import { createWidget } from 'discourse/widgets/widget';

createWidget('custom-header-links', {
  tagName: 'nav.custom-header-links',
  buildKey: (attrs) => `custom-header-links-${attrs.id}`,

  buildClasses(attrs) {
    const { scrolling } = attrs;
    const classes = [];

    if (scrolling) {
      classes.push('scrolling');
    }

    return classes;
  },

  transform(attrs) {
    const { headerLinks } = attrs;

    return {
      headerLinks,
    };
  },

  defaultState() {
    //let showLinks = !this.site.mobileView;
    let showLinks = true;
    //const mobileView = this.site.mobileView;
    const mobileView = false;

    return {
      mobileView,
      showLinks,
    };
  },

  toggleHeaderLinks() {
    this.state.showLinks = !this.state.showLinks;
    if (this.state.showLinks) {
      document.body.classList.add("dropdown-header-open");
    } else {
      document.body.classList.remove("dropdown-header-open");
    }
  },

  clickOutside() {
    if (this.site.desktopView) {
      return;
    }

    if (this.state.showLinks) {
      //this.sendWidgetAction("toggleHeaderLinks");
      return;
    }
  },

  template: hbs`
    {{#if this.state.mobileView}}
      <span class="btn-custom-header-dropdown-mobile">
        {{attach
            widget="button"
            attrs=(hash
              action="toggleHeaderLinks"
              icon="caret-square-down"
            )
        }}
      </span>
    {{/if}}
    {{#if this.state.showLinks}}
      <ul class="top-level-links">
          {{#each transformed.headerLinks as |item|}}
            {{attach
              widget="custom-header-link"
              attrs=item
              showHeaderLinks="showHeaderLinks"
            }}
          {{/each}}
      </ul>
    {{/if}}
  `,
});
