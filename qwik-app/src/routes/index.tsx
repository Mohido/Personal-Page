import { $, component$, useSignal, useStore, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Canvas3D } from "~/components/canvas";
import { LeftMenu } from "~/components/left-menu";
import IndexCSS from "./index.css?inline";


export interface Details {
  imgURL: string;
  title: string;
  description: string;
}


export type DetailsMap = {[key: string]: Details};

export default component$(() => {
  useStyles$(IndexCSS);
  const activeID = useSignal<string>("Work Experience");
  const leftMenuClick$ = $((item: string) => {
    activeID.value = item;
  });

  const details = useStore<DetailsMap>({
    nokia: {
      imgURL: "https://logo.clearbit.com/nokia.com",
      title: "Software Developer (Nokia) [2021 - 2023]",
      description:
        "Nokia Corporation is a Finnish multinational telecommunications, information technology, and consumer electronics company, founded in 1865.",
    },
    ericsson : {
      imgURL: "https://logo.clearbit.com/ericsson.com",
      title: "Senior Software Developer (Ericsson) [2024 - Present]",
      description:
        "Ericsson is a Swedish multinational networking and telecommunications company headquartered in Stockholm.",
    },
  });


  const modalStore = useStore({
    active : false,
    title : ""
  });

  const updateModalStore$ = $((active: boolean, title: string) => {
    modalStore.active = active;
    modalStore.title = title;
  });

  return (
    <>
      <div class="container">
        <LeftMenu items={["Work Experience", "About", "Contact"]} onClick$={leftMenuClick$}/>
        <Canvas3D onClick$={(title)=> updateModalStore$(true, title)} details={details} activeID={activeID.value}/>
      </div>
      {
        modalStore.active && 
        modalStore.title &&
        details[modalStore.title] &&
          <div class="modal">
            <div class="modal-content">
              <span class="close">
                <span class="close-x" onClick$={() => updateModalStore$(false, "")}>
                  &times;
                </span>
              </span>
              <div class="modal-body">
                <div class="modal-description">
                  <h1>{details[modalStore.title].title}</h1>
                  <p>{details[modalStore.title].description}</p>
                </div>
                <img width="208" height="208" src={details[modalStore.title].imgURL} alt="Company Logo"/>
              </div>
            </div>
          </div>
      }
    </>
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
