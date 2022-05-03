import { apiInitializer } from 'discourse/lib/api';

export default apiInitializer('0.11.1', (api) => {
  const headerLinks = JSON.parse(settings.header_links);

  const links_position =
    settings.links_position === 'right'
      ? 'header-buttons:before'
      : 'home-logo:after';

  api.decorateWidget(links_position, (helper) => {
    const scrolling = helper.attrs.minimized;
    return helper.widget.attach('custom-header-links', {
      headerLinks,
      scrolling,
    });
  });
});
