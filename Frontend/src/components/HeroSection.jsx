import heroBg from "../assets/task-bg-dark.jpg"; 

export default function HeroSection() {
  return (<>
    <section
          style={{ backgroundImage: `url(${heroBg})` }}
      className="bg-cover bg-black/40 bg-center bg-no-repeat min-h-screen relative "
      
    >
        <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 text-white p-8"> 
        <h1 className="text-left mt-20 ml-10 m-3 font-bold leading-tight text-6xl font-Roboto">Rise Together,<br/>Build More. Turn chaos <br/> into clarity!</h1>
        <p className="text-left  ml-12 font-bold text-xl text-neutral-200">Empowering you to reach the top together.<br /> All your tasks, one powerful dashboard.</p>
        <a href="#" className="bg-rose-600 px-10 py-3 items-center justify-center p  rounded-md cursor-pointer hover:bg-rose-700">Get Started</a>
      </div>
      
    </section>
  </>
  );
}