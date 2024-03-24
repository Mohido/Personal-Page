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
}


/**
 * Stores a specific scene and mesh
 */
export interface Canvas3D{
    scene : THREE.Scene,
    mesh : THREE.Object3D
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
    const initRenderer$ = $(()=>{
        // Create Renderer
        if(!canvasStore.renderer){
            canvasStore.renderer = noSerialize(new THREE.WebGLRenderer({canvas: canvasRef.value}));
            canvasStore.renderer?.setSize( canvasStore.width, canvasStore.height);
            canvasStore.renderer?.setClearAlpha(0);
        }
        
        // Create Camera
        if(!canvasStore.camera){
            canvasStore.camera = noSerialize(new THREE.PerspectiveCamera( 75, canvasStore.width / canvasStore.height, 0.1, 1000 ));
            if(canvasStore.camera){
                canvasStore.camera && (canvasStore.camera.position.z = 5);
                // canvasStore.controls = noSerialize(new OrbitControls(canvasStore.camera, canvasStore.renderer?.domElement));
            }
        }
    });

    

    /**
     * Used to resize the renderer in case the canvasStore is not equal to the props.
     */
    const resizeRenderer$ = $(()=>{
        // console.log(canvasStore.width);
        if( canvasStore.width !== canvasRef.value?.clientWidth || canvasStore.height !== canvasRef.value?.clientHeight){
            
            canvasStore.height = canvasRef.value?.clientHeight || 500;
            canvasStore.width = canvasRef.value?.clientWidth || 500;
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
        // Fetch the .obj file from an endpoint
        const objLoader = new OBJLoader();
        // TODO: Load the coin instead of the cube
        const mesh = await objLoader.loadAsync(`/cube.obj`);   
        const scene = new THREE.Scene();
        scene.add(mesh);

        ctos[props.activeID] = {
            mesh : mesh, scene : scene
        }
    });


        /**
     * Updates the scene objects (handles mesh rotation)
     */
    const update$ = $(async ()=>{
        // Check if resizing is needed
        await resizeRenderer$();

        // Load the active scene if not loaded yet.
        await loadActiveScene$();
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
            
            canvasStore.width = canvasRef.value?.clientWidth || 500;
            canvasStore.height = canvasRef.value?.clientHeight || 500;

            // Initialize renderer
            await initRenderer$();
    
            // Load Actiive Character Scene
            await loadActiveScene$();
    
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