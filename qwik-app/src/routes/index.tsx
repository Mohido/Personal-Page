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
  const details : {[key:string]:DetailsMap} ={
      "Experience": {
        nokia: {
          imgURL: "https://logo.clearbit.com/nokia.com",
          title: "Software Developer (Nokia) [2021 - 2023]",
          description:
            "Nokia Corporation is a Finnish multinational telecommunications, information technology, and consumer electronics company, founded in 1865. And, there I did the following:" +
            "○ Contributed to the maintenance and enhancement of a large-scale, cloud-native Platform as a Service (PaaS) that integrates 100+ Cloud Service Functions, demonstrating scalability and flexibility." +
            "○ Engaged in system engineering and DevOps practices, utilizing Python automation, REST API development, Docker, Terraform and Ansible for optimal service management across 3 to 16 node environments." +
            "○ Addressed critical MariaDB issues, including brain-splits in a 3-node setup, ensuring database integrity and high availability." +
            "○ Participated in agile project management, facilitating faster production through continuous integration and delivery practices." +
            "○ Assisted in solving intricate networking, system, and coding challenges, enhancing system efficiency and user satisfaction."
            ,
        },
        ericsson : {
          imgURL: "https://logo.clearbit.com/ericsson.com",
          title: "Senior Software Developer (Ericsson) [2024 - Present]",
          description:
            "Ericsson is a Swedish multinational networking and telecommunications company headquartered in Stockholm. There, I did the following: \n" +
            "○ Played a crucial role in developing a critical distributed Virtual Network Function (VNF) within the IMS network, deployed across over 20 virtual machines to enhance network efficiency and scalability.\n"+
            "○ Leveraged Erlang/OTP for robust runtime environment management and Python for effective automation processes, contributing to operational efficiency.\n" +
            "○ Managed hundreds of concurrent processes, resolving complex issues such as race conditions and deadlocks, thereby ensuring system reliability and stability.\n" +
            "○ Adopted Agile methodologies to support a continuous development and deployment cycle, significantly reducing time-to-market for new features and updates.\n",
        },
        elte : {
          imgURL: "https://upload.wikimedia.org/wikipedia/en/a/af/ELTE_logo.png",
          title: "Teacher Assistant (ELTE) [2021 - 2022]",
          description:
            `Eötvös Loránd University is a Hungarian public research university based in Budapest. And there I did:
            ○ Introduced over 100 students to functional programming paradigms using the Clean Programming Language, enriching the academic curriculum and fostering a deeper understanding of programming concepts.
            ○ Provided more than 20 comprehensive consultations on complex data structures and algorithms, enhancing students’ problemsolving skills.
            ○ Created and administered 4 examinations, assessing and grading students’ understanding and application of functional programming concepts, contributing to their academic success.
            `,
        }
      },
      "Programming": {
        cpp: {
          imgURL: "https://raw.githubusercontent.com/isocpp/logos/master/cpp_logo.png",
          title: "C++",
          description: "C++ is a general-purpose programming language created by Bjarne Stroustrup as an extension of the C programming language, or C with Classes.",
        },
        python: {
          imgURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/219px-Python-logo-notext.svg.png",
          title: "Python",
          description: "Python is an interpreted high-level general-purpose programming language.",
        },
        javascript: {
          imgURL: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Javascript_Logo.png",
          title: "JavaScript",
          description:
            "JavaScript, often abbreviated as JS, is a programming language that conforms to the ECMAScript specification.",
        },
        nodejs: {
          imgURL: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
          title: "Node.js",
          description:
            "Node.js is an open-source, cross-platform, back-end JavaScript runtime environment that runs on the V8 engine and executes JavaScript code outside a web browser.",
        },
        bash : {
          imgURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Bash_Logo_Colored.svg/240px-Bash_Logo_Colored.svg.png",
          title: "Bash",
          description: "Bash is a Unix shell and command language written by Brian Fox for the GNU Project as a free software replacement for the Bourne shell.",
        }
      },
      "Techstack": {
        mysql : {
          imgURL: "https://upload.wikimedia.org/wikipedia/en/d/dd/MySQL_logo.svg",
          title: "MySQL",
          description: "MySQL is an open-source relational database management system.",
        },
        postgresql : {
          imgURL: "https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg",
          title: "PostgreSQL",
          description: "PostgreSQL, also known as Postgres, is a free and open-source relational database management system emphasizing extensibility and SQL compliance.",
        },
        docker : {
          imgURL: "https://cdn.icon-icons.com/icons2/2699/PNG/512/docker_tile_logo_icon_168248.png",
          title: "Docker",
          description: "Docker is a set of platform as a service products that use OS-level virtualization to deliver software in packages called containers.",
        },
        git : {
          imgURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Git-logo.svg/1280px-Git-logo.svg.png",
          title: "Git",
          description: "Git is a distributed version-control system for tracking changes in source code during software development.",
        },
        flask : {
          imgURL: "https://flask.palletsprojects.com/en/2.0.x/_images/flask-logo.png",
          title: "Flask",
          description: "Flask is a micro web framework written in Python.",
        },
        keycloak : {
          imgURL: "https://avatars2.githubusercontent.com/u/4921466?s=400&v=4",
          title: "Keycloak",
          description: "Keycloak is an open-source software product to allow single sign-on with Identity Management and Access Management aimed at modern applications and services.",
        },
        kubernetes : {
          imgURL: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg",
          title: "Kubernetes",
          description: "Kubernetes is an open-source container-orchestration system for automating computer application deployment, scaling, and management.",
        },
        ansible : {
          imgURL: "https://upload.wikimedia.org/wikipedia/commons/0/05/Ansible_Logo.png",
          title: "Ansible",
          description: "Ansible is an open-source software provisioning, configuration management, and application-deployment tool.",
        },
        jenkins : {
          imgURL: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Jenkins_logo.svg",
          title: "Jenkins",
          description: "Jenkins is a free and open-source automation server.",
        },
        blender : {
          imgURL: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Blender_logo_no_text.svg",
          title: "Blender",
          description: "Blender is a free and open-source 3D computer graphics software toolset used for creating animated films, visual effects, art, 3D printed models, motion graphics, interactive 3D applications, virtual reality, and computer games.",
        },
        davinciresolve : {
          imgURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/DaVinci_Resolve_17_logo.svg/240px-DaVinci_Resolve_17_logo.svg.png",
          title: "DaVinci Resolve",
          description: "DaVinci Resolve is a color correction and non-linear video editing application for macOS, Windows, and Linux.",
        },
        vulkanapi : {
          imgURL: "https://th.bing.com/th/id/OIP.Tj_cM0rhDnVtw-hK4hHkGgHaHa?rs=1&pid=ImgDetMain",
          title: "Vulkan API",
          description: "Vulkan is a low-overhead, cross-platform 3D graphics and computing API.",
        },
        
      },
      "Certifications": {
        networkplus : {
          imgURL: "/NetworkPlus Logo Certified CE.jpg",
          title: "CompTIA Network+",
          description: "CompTIA Network+ is a certification that covers networking concepts, troubleshooting, operations, tools, and security as well as IT infrastructure. You can verify my certificate with the Code: [784928BR12V11T32] and Verify at: [http://verify.CompTIA.org]",
        },
        securityplus : {
          imgURL: "/SecurityPlus Logo Certified CE.jpg",
          title: "CompTIA Security+",
          description: "CompTIA Security+ is a global certification that validates the baseline skills you need to perform core security functions and pursue an IT security career.  You can verify my certificate with the Code: [L6BQ5BFTLBR41F57] and Verify at: [http://verify.CompTIA.org]",
        },
      },
      "Reach Me": {
        email: {
          imgURL: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Gmail_Icon_%282013-2020%29.svg",
          title: "Personal Email",
          description: "You can reach me at this email address: mohidoart@gmail.com. Expect an answer within 3 days.",
        },
        // x : {
        //   imgURL: "https://th.bing.com/th/id/OIP.czrnEGcGZejUl3yJc590YgHaG9?rs=1&pid=ImgDetMain",
        //   title: "X (Twitter)",
        //   description: "You can reach me at this email address. Expect an answer within 24 hours.",
        // },
        linkedin : {
          imgURL: "https://th.bing.com/th/id/OIP.d9YMY3jpZr_ZxliOr3xMYQHaHa?rs=1&pid=ImgDetMain",
          title: "LinkedIn",
          description: "Follow me on Linkedin to get updates on my professional life. My user id is [in/mohammed-al-mahdawi-a14906206]",
        },
        youtube : {
          imgURL: "https://upload.wikimedia.org/wikipedia/commons/7/72/YouTube_social_white_square_%282017%29.svg",
          title: "YouTube",
          description: "Subscribe to my YouTube channel to get updates on my personal life. My programming channel is [www.youtube.com/@MohidoTech]. Also, my art channel is: [www.youtube.com/@MohidoArt]",
        },
        artstation : {
          imgURL: "/artstation.jpg",
          title: "ArtStation",
          description: "Follow me on ArtStation to get updates on my art life. My user id is [mohidoart]",
        },
      }
    };

    const activeID = useSignal<string>("Experience");
    const leftMenuClick$ = $((item: string) => {
      activeID.value = item;
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
        <LeftMenu items={Object.keys(details)} onClick$={leftMenuClick$}/>
        <Canvas3D onClick$={(title)=> updateModalStore$(true, title)} details={details[activeID.value]} activeID={activeID.value}/>
      </div>
      {
        modalStore.active && 
          <div class="modal">
            <div class="modal-content">
              <span class="close">
                <span class="close-x" onClick$={() => updateModalStore$(false, "")}>
                  &times;
                </span>
              </span>
              <div class="modal-body">
                <div class="modal-description">
                  <h1>{details[activeID.value][modalStore.title].title}</h1>
                  <p>{details[activeID.value][modalStore.title].description}</p>
                </div>
                <img width="208" height="208" src={details[activeID.value][modalStore.title].imgURL} alt="Company Logo"/>
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
