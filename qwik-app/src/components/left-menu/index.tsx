/**
 * TO MY FUTURE SELF, I just managed to make this work and responsive, please don't fok it up in the future!
 */

import { type QRL, component$, useStyles$, useSignal, useVisibleTask$, $, useOnWindow } from "@builder.io/qwik";
import IndexCSS from "./index.css?inline";
import { useLocation } from "@builder.io/qwik-city";


export interface LeftMenuProps {
    items: string[];                            // Represents which item is clicked.
    onClick$: QRL<(item: string) => void>;      // Represents which item is clicked.
}



export const LeftMenu = component$((props: LeftMenuProps) => {
    useStyles$(IndexCSS);
    const loc = useLocation();
    const hidclas = useSignal<string>("hidden-menu");
    const refLM = useSignal<HTMLDivElement>();

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
        if(refLM.value?.clientHeight === 0){
            hidclas.value = "hidden-menu";
        }else{
            hidclas.value = "shown-menu";
        }
    },{ strategy: 'document-ready' });

    useOnWindow("resize", $((ev)=>{
        if(hidclas.value === "hidden-menu" && (ev.target as Window).innerWidth > 720)
            hidclas.value = "shown-menu";
        else if(hidclas.value === "shown-menu" && (ev.target as Window).innerWidth < 720)
            hidclas.value = "hidden-menu";
    }));

    const toggleMenu$ = $(()=>{
        if(refLM.value?.clientHeight === 0){
            hidclas.value = "shown-menu";
        }else{
            hidclas.value = "hidden-menu";
        }
    });

    return (
        <>
            <div class="menu-toggle-button" onClick$={toggleMenu$}>☰</div>
            <div ref={refLM} class={"left-menu " + hidclas.value}>
                <div class="profile-image" style={`background-image: url(${loc.url.origin}/profile_picture.jpg)`}></div>
                <h1 class="header">Mohido</h1>
                <ul>
                    {props.items.map((item) => (
                        <li class="menu-item" key={item} onClick$={() => {
                                (window.innerWidth < 720 && (hidclas.value = "hidden-menu"));
                                props.onClick$(item)}
                            }>
                            {item}
                        </li>
                    ))}
                </ul>
                <div class="footer">
                    {/* Copyright message */}
                    <p>&copy; 2024 Mohammed Al-Mahdawi. All rights reserved.</p>
                </div>
            </div>
        
        </>
        
    );
});