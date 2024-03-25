import { type QRL, component$, useStyles$ } from "@builder.io/qwik";
import IndexCSS from "./index.css?inline";
import { useLocation } from "@builder.io/qwik-city";


export interface LeftMenuProps {
    items: string[];                            // Represents which item is clicked.
    onClick$: QRL<(item: string) => void>;      // Represents which item is clicked.
}



export const LeftMenu = component$((props: LeftMenuProps) => {
    useStyles$(IndexCSS);
    const loc = useLocation();
    return (
        <div class="left-menu">
            <div class="profile-image" style={`background-image: url(${loc.url.origin}/profile_picture.jpg)`}></div>
            <h1 class="header">Mohido</h1>
            <ul>
                {props.items.map((item) => (
                    <li class="menu-item" key={item} onClick$={() => props.onClick$(item)}>
                        {item}
                    </li>
                ))}
            </ul>
            <div class="footer">
                {/* Copyright message */}
                <p>&copy; 2022 Mohammed Al-Mahdawi. All rights reserved.</p>
            </div>
        </div>
    );
});