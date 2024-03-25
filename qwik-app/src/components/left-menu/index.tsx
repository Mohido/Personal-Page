import { type QRL, component$, useStyles$ } from "@builder.io/qwik";
import IndexCSS from "./index.css?inline";


export interface LeftMenuProps {
    items: string[];                            // Represents which item is clicked.
    onClick$: QRL<(item: string) => void>;      // Represents which item is clicked.
}



export const LeftMenu = component$((props: LeftMenuProps) => {
    useStyles$(IndexCSS);
    return (
        <div class="left-menu">
            <div class="profile-image"></div>
            <h1 class="header">Mohido</h1>
            <ul>
                {props.items.map((item) => (
                    <li class="menu-item" key={item} onClick$={() => props.onClick$(item)}>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
});