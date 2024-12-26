import { Default } from "./default";

import renderToString from "preact-render-to-string";

export async function render(
  _url: string /*, _template: string, _mdxpath: string */
) {
  // Dynamically import the MDX content
  const { default: Content } = await import(_url);

  // Render the content inside the Default component
  // TODO: Add template support use vite plugin
  // TODO: Fix client side hydration
  const html = renderToString(
    <Default>
      <Content />
    </Default>
  );
  return { html };
}
