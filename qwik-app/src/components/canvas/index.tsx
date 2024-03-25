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
    width : number,
    height : number,
}

export interface Canvas3DNonSerializableStore{
    renderer? : THREE.WebGLRenderer,
    camera? : THREE.PerspectiveCamera,
    mesh? : THREE.Mesh  // The mesh which will be instanced from
    raycaster? : THREE.Raycaster,
    mouse? : THREE.Vector2
};


/**
 * Stores a specific scene and mesh
 */
export interface Canvas3D{
    scene : THREE.Scene;
    meshToDetails? : {[key: string]: string}  // mesh to title hashmap. This is used when a mesh is clicked on to view the details.
}


export interface Canvas3DProps{
    activeID : string;
    details : {[key: string]: { // The details of every mesh. This is used for popups and modals
        title : string,
        imgURL : string,
        description : string
    }}
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
    const threeStore : Canvas3DNonSerializableStore = {};


    /**
     * used to initialize the renderer and the camera if they are not yet initialized. 
     */
    const initRenderer$ = $(async ()=>{
        // Create Renderer
        if(!threeStore.renderer){
            canvasStore.width = canvasRef.value?.clientWidth || 500;
            canvasStore.height = canvasRef.value?.clientHeight || 500;
            threeStore.renderer = noSerialize(new THREE.WebGLRenderer({canvas: canvasRef.value}));
            threeStore.renderer?.setSize( canvasStore.width, canvasStore.height);
            threeStore.renderer?.setClearAlpha(0);
        }
        
        // Create Camera
        if(!threeStore.camera){
            threeStore.camera = new THREE.PerspectiveCamera( 75, canvasStore.width / canvasStore.height, 0.1, 1000 );
            if(threeStore.camera){
                threeStore.camera && (threeStore.camera.position.z = 10);
                // canvasStore.controls = noSerialize(new OrbitControls(canvasStore.camera, canvasStore.renderer?.domElement));
            }
        }

        // Load the mesh
        const objLoader = new OBJLoader();
        threeStore.mesh = (await objLoader.loadAsync(`/coin.obj`)).children[0] as THREE.Mesh; 

        // Create Raycaster and Mouse
        threeStore.raycaster =new THREE.Raycaster();
        threeStore.mouse = new THREE.Vector2();
    });

    

    /**
     * Used to resize the renderer in case the canvasStore is not equal to the props.
     */
    const resizeRenderer$ = $(()=>{
        if( canvasStore.width !== canvasRef.value?.clientWidth || canvasStore.height !== canvasRef.value?.clientHeight){
            canvasStore.height = canvasRef.value?.clientHeight || 500;
            canvasStore.width = canvasRef.value?.clientWidth || 500;
            // Resize the renderer but not changing the canvas style.
            threeStore.renderer?.setSize(canvasStore.width, canvasStore.height, false);
            threeStore.camera && (threeStore.camera.aspect = canvasStore.width/canvasStore.height);
            threeStore.camera?.updateProjectionMatrix();
        }
    });


    /**
     * Sends a fetch request to load scene data. It updates the scenes hashmap directly.
     */
    const loadActiveScene$ = $(async ()=>{
        if(ctos[props.activeID]){
            return;
        }

        if(threeStore.mesh === undefined){
            throw new Error("Mesh not loaded yet");
        }

        const scene = new THREE.Scene();
        const meshToDetails : {[key: string]: string} = {}; 

        // For each details, create a mesh and add it to the scene
        props.details && Object.keys(props.details).forEach((key: string)=>{
            const mesh = threeStore.mesh?.clone() as THREE.Mesh;
            // Load material image from the details.imgUrl
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(props.details[key].imgURL);
            const material = new THREE.MeshBasicMaterial({map: texture});
            if(mesh && texture && material ){
                mesh.material = material; // Apply the material to the mesh
                // mesh.position.x = Math.random() * 10 - 5;
                // mesh.position.y = Math.random() * 10 - 5;
                // mesh.position.z = Math.random() * 10 - 5;
                meshToDetails[mesh.uuid] = key;
                scene.add(mesh);
            }
        });

        // scene.add(threeStore.mesh.clone());
        // add light
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 0, 1);
        scene.add(light);
        ctos[props.activeID] = {
           scene : scene,
            meshToDetails : meshToDetails
        }
    });


    useOn("mousemove", $((event: MouseEvent)=>{
        if(threeStore.mouse){
            threeStore.mouse.x = ( event.offsetX / canvasStore.width ) * 2 - 1;
            threeStore.mouse.y = - ( event.offsetY / canvasStore.height ) * 2 + 1;
        }else{
            console.error("Mouse is not defined");
            throw new Error("Mouse is not defined");
        }
    }));


    const finalY = -Math.PI/2 + 0.1;
    const finalX = Math.PI/2;
    const finalZ = 0;
    const animateCoins$ = $(()=>{
        if(threeStore.raycaster === undefined){
            throw new Error("Raycaster not defined");
        }
        // Update the picking ray with the camera and mouse position
        threeStore.mouse && 
        threeStore.camera &&
        threeStore.raycaster.setFromCamera(threeStore.mouse, threeStore.camera);

        // Calculate objects intersected by the ray
        const intersects = threeStore.raycaster.intersectObjects(ctos[props.activeID].scene.children);
        
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
                if(object.rotation.y != finalY){
                    object.rotation.y += 0.01 * Math.sign(finalY - object.rotation.y);
                }
                if(object.rotation.x != finalX){
                    object.rotation.x += 0.01 * Math.sign(finalX - object.rotation.x);
                }
                if(object.rotation.z != finalZ){
                    object.rotation.z += 0.01 * Math.sign(finalZ - object.rotation.z);
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
        threeStore.camera && threeStore.renderer?.render(ctos[props.activeID].scene, threeStore.camera);
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

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async ({cleanup})=>{
        // Initialize renderer
        await initRenderer$();

        // Create Animation
        const handle = await animate();
        cleanup(()=> cancelAnimationFrame(handle));
    });

    return (
        <canvas ref={canvasRef} class="canvas3d"></canvas>
    );
});