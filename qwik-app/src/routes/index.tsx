import { $, component$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Canvas3D } from "~/components/canvas";
import { LeftMenu } from "~/components/left-menu";
import IndexCSS from "./index.css?inline";


export default component$(() => {
  useStyles$(IndexCSS);


  const leftMenuClick$ = $((item: string) => {
    console.log("Item clicked: ", item);
  });


  return (
    <div class="container">
      <LeftMenu items={["Home", "About", "Contact"]} onClick$={leftMenuClick$}/>
      <Canvas3D activeID="Home"/>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Mohido Page",
  meta: [
    {
      name: "description",
      content: "This is my personal page",
    },
  ],
};
