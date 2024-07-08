import { apiInitializer } from "discourse/lib/api";
import CustomHeaderLinks from "../components/custom-header-links";

export default apiInitializer("1.29.0", (api) => {
  if (!settings.header_links) {
    return;
  }

  if (settings.links_position === "right") {
    api.headerButtons.add("dropdown-header", CustomHeaderLinks, {
      before: "auth",
    });
  } else {
    api.renderAfterWrapperOutlet("home-logo", CustomHeaderLinks);
  }
});
