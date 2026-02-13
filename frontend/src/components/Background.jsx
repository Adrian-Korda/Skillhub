const Background = () => {
    return (
        <div className="fixed inset-0 -z-10 h-full w-full bg-[#0a0a0a] overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-black via-black bg-black-bg"></div>

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[linear-gradient(to_top,black_40%,transparent_100%)] opacity-20"></div>

            <div className="absolute -bottom-[20%] -left-[10%] h-125 w-125 rounded-full bg-indigo-900 opacity-20 blur-[120px]"></div>

            <div className="absolute -bottom-[20%] -right-[10%] h-125 w-125 rounded-full bg-blue-900 opacity-20 blur-[120px]"></div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-75 w-150 rounded-full bg-blue-600 opacity-10 blur-[100px]"></div>
        </div>
    );
};

export default Background;