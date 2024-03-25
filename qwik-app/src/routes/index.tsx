import { $, component$, useSignal, useStore, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Canvas3D } from "~/components/canvas";
import { LeftMenu } from "~/components/left-menu";
import IndexCSS from "./index.css?inline";


export default component$(() => {
  useStyles$(IndexCSS);
  const activeID = useSignal<string>("Home");

  const leftMenuClick$ = $((item: string) => {
    console.log("Item clicked: ", item);
    activeID.value = item;
  });


  return (
    <div class="container">
      <LeftMenu items={["Home", "About", "Contact"]} onClick$={leftMenuClick$}/>
      <Canvas3D details={{nokia : {
          imgURL: "https://logo.clearbit.com/nokia.com",
          title: "Nokia",
          description: "Nokia Corporation is a Finnish multinational telecommunications, information technology, and consumer electronics company, founded in 1865."
      }}} activeID={activeID.value}/>
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
