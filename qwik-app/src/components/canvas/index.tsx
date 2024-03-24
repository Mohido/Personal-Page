import { $, component$, noSerialize, useOn, useSignal, useStore, useStyles$, useVisibleTask$ } from "@builder.io/qwik";
import IndexCSS from "./index.css?inline";
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import style from './style.css?inline';


/**
 * The canvasStore of teh component. It contains the constants (renderer and camera)
 */
export interface Canvas3DStore{
    renderer? : THREE.WebGLRenderer,
    camera? : THREE.PerspectiveCamera,
    width : number,
    height : number,
    mesh? : THREE.Object3D  // The mesh which will be instanced from
    raycaster? : THREE.Raycaster,
    mouse? : THREE.Vector2
}


/**
 * Stores a specific scene and mesh
 */
export interface Canvas3D{
    scene : THREE.Scene,
}


export interface Canvas3DProps{
    activeID : string;
}

export const Canvas3D = component$((props: Canvas3DProps) => {
    useStyles$(IndexCSS);
    const canvasRef = useSignal<HTMLCanvasElement>();       // Referenced for the WebGLRenderer
    // const containerRef = useSignal<HTMLDivElement>();       // Referenced for updating the size
    const canvasStore = useStore<Canvas3DStore>({
        width : 500,
        height : 500
    });
    
    // canvas to scene hashmap. Each key represents a scene
    const ctos : {[key: string]: Canvas3D} = {};



    /**
     * used to initialize the renderer and the camera if they are not yet initialized. 
     */
    const initRenderer$ = $(async ()=>{
        // Create Renderer
        if(!canvasStore.renderer){
            canvasStore.width = canvasRef.value?.clientWidth || 500;
            canvasStore.height = canvasRef.value?.clientHeight || 500;
            canvasStore.renderer = noSerialize(new THREE.WebGLRenderer({canvas: canvasRef.value}));
            canvasStore.renderer?.setSize( canvasStore.width, canvasStore.height);
            canvasStore.renderer?.setClearAlpha(0);
        }
        
        // Create Camera
        if(!canvasStore.camera){
            canvasStore.camera = noSerialize(new THREE.PerspectiveCamera( 75, canvasStore.width / canvasStore.height, 0.1, 1000 ));
            if(canvasStore.camera){
                canvasStore.camera && (canvasStore.camera.position.z = 10);
                // canvasStore.controls = noSerialize(new OrbitControls(canvasStore.camera, canvasStore.renderer?.domElement));
            }
        }

        // Load the mesh
        const objLoader = new OBJLoader();
        canvasStore.mesh = noSerialize(await objLoader.loadAsync(`/coin.obj`)); 

        // Create Raycaster and Mouse
        canvasStore.raycaster = noSerialize(new THREE.Raycaster());
        canvasStore.mouse = noSerialize(new THREE.Vector2());
    });

    

    /**
     * Used to resize the renderer in case the canvasStore is not equal to the props.
     */
    const resizeRenderer$ = $(()=>{
        if( canvasStore.width !== canvasRef.value?.clientWidth || canvasStore.height !== canvasRef.value?.clientHeight){
            canvasStore.height = canvasRef.value?.clientHeight || 500;
            canvasStore.width = canvasRef.value?.clientWidth || 500;
            // Resize the renderer but not changing the canvas style.
            canvasStore.renderer?.setSize(canvasStore.width, canvasStore.height, false);
            canvasStore.camera && (canvasStore.camera.aspect = canvasStore.width/canvasStore.height);
            canvasStore.camera?.updateProjectionMatrix();
        }
    });


    /**
     * Sends a fetch request to load scene data. It updates the scenes hashmap directly.
     */
    const loadActiveScene$ = $(async ()=>{
        if(ctos[props.activeID]){
            return;
        }

        if(canvasStore.mesh === undefined){
            throw new Error("Mesh not loaded yet");
        }

        const scene = new THREE.Scene();
        scene.add(canvasStore.mesh.clone());

        ctos[props.activeID] = {
           scene : scene
        }
    });


    useOn("mousemove", $((event: MouseEvent)=>{
        if(canvasStore.mouse){
            canvasStore.mouse.x = ( event.offsetX / canvasStore.width ) * 2 - 1;
            canvasStore.mouse.y = - ( event.offsetY / canvasStore.height ) * 2 + 1;
        }else{
            console.error("Mouse is not defined");
            throw new Error("Mouse is not defined");
        }
    }));


    const animateCoins$ = $(()=>{
        if(canvasStore.raycaster === undefined){
            throw new Error("Raycaster not defined");
        }
        // Update the picking ray with the camera and mouse position
        canvasStore.mouse && 
        canvasStore.camera &&
        canvasStore.raycaster.setFromCamera(canvasStore.mouse, canvasStore.camera);

        // Calculate objects intersected by the ray
        const intersects = canvasStore.raycaster.intersectObjects(ctos[props.activeID].scene.children);
        
        let chosenMesh : THREE.Mesh | undefined = undefined;
        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object instanceof THREE.Mesh) {
                chosenMesh = intersects[i].object as THREE.Mesh;
                // console.log("Mouse is over the mesh: ", chosenMesh);
                canvasRef.value?.style.setProperty('cursor', 'pointer');
                break;
            }
        }
        if(!chosenMesh){
            canvasRef.value?.style.setProperty('cursor', 'default');
        }

        // Rotate the mesh if the mouse is not pointed to it
        ctos[props.activeID].scene.traverse((object: THREE.Object3D) => {
            if (object instanceof THREE.Mesh && object !== chosenMesh) { 
                object.scale.set(1, 1, 1);
                object.rotateX(0.01);
                object.rotateY(0.01);
                object.rotateZ(-0.01);
            }else if (object === chosenMesh){
                object.scale.x < 1.5 && object.scale.addScalar(0.01);
                if(object.rotation.x != Math.PI/2 ){
                    object.rotation.x += 0.01 * Math.sign(Math.PI/2 - object.rotation.x); 
                }
                if(object.rotation.y != 0){
                    object.rotation.y += 0.01 * Math.sign(-object.rotation.y);
                }
                if(object.rotation.z != 0){
                    object.rotation.z += 0.01 * Math.sign(-object.rotation.z);
                }
            }
        });
    });


    /**
     * Updates the scene objects (handles mesh rotation)
     */
    const update$ = $(async ()=>{
        // Check if resizing is needed
        await resizeRenderer$();

        // Load the active scene if not loaded yet.
        await loadActiveScene$();

        // Animates the meshes inside the scene.
        await animateCoins$();
    });


    /**
     * Renders the active scene using the renderer.
     */
    const render$ = $(()=>{
        canvasStore.camera && canvasStore.renderer?.render(ctos[props.activeID].scene, canvasStore.camera);
    })


    /**
     * Starts the animation loop. This QRL contains a recursive function which does the "gameloop".
     */
    const animate = $(()=>{
        const animation = async ()=>{
            await update$();
            await render$();
            return requestAnimationFrame(animation);
        }
        return  requestAnimationFrame(animation);
    });

    /**
     * Only called once during the initial component rendering. After that, the application updates automatically through
     * the use of requestframeanimation();
     */
    useVisibleTask$(async ({cleanup})=>{
        // Initialize renderer
        await initRenderer$();

        // Create Animation
        const handle = await animate();
        cleanup(()=> cancelAnimationFrame(handle));
    });

    return (
        // <div ref={containerRef} class="canvas3d-container">
           <canvas ref={canvasRef} class="canvas3d"></canvas>
        // </div>
    );
});