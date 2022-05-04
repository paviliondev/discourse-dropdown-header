import { iconNode } from 'discourse-common/lib/icon-library';
import { h } from 'virtual-dom';

export function buildIcon(icon) {
  const iconSource = settings.icon_source;
  const IMAGE_SOURCE = 'image_url';
  const FONT_AWESOME_SOURCE = 'font_awesome';

  if (icon === null || icon === undefined) {
    return;
  }

  switch (iconSource) {
    case FONT_AWESOME_SOURCE:
      return iconNode(icon);
      break;
    case IMAGE_SOURCE:
      return h(
        'img',
        {
          attributes: {
            src: icon,
          },
        },
        ''
      );
    default:
      return iconNode(icon);
      break;
  }
}

export default function buildIconHTML(icon, classes = []) {
  if (!icon) {
    return;
  }

  classes.push('custom-header-link-icon');
  return h(`span.${classes.join('.')}`, buildIcon(icon));
}
