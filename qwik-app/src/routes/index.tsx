import { $, component$, useSignal, useStore, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Canvas3D } from "~/components/canvas";
import { LeftMenu } from "~/components/left-menu";
import IndexCSS from "./index.css?inline";


export default component$(() => {
  useStyles$(IndexCSS);
  const activeID = useSignal<string>("Home");
  const leftMenuClick$ = $((item: string) => {
    activeID.value = item;
  });

  const details = {
    nokia: {
      imgURL: "https://logo.clearbit.com/nokia.com",
      title: "Nokia",
      description:
        "Nokia Corporation is a Finnish multinational telecommunications, information technology, and consumer electronics company, founded in 1865.",
    },
    ericsson : {
      imgURL: "https://logo.clearbit.com/ericsson.com",
      title: "Ericsson",
      description:
        "Ericsson is a Swedish multinational networking and telecommunications company headquartered in Stockholm.",
    },
  };



  return (
    <div class="container">
      <LeftMenu items={["Home", "About", "Contact"]} onClick$={leftMenuClick$}/>
      <Canvas3D details={details} activeID={activeID.value}/>
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
