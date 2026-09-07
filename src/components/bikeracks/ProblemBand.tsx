import { problem } from "@/lib/bikeRacksListicle";

export function ProblemBand() {
  return (
    <div className="mx-5 my-10 rounded-xl bg-brand-black px-6 py-10 text-white sm:mx-10 sm:px-10 sm:py-12">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tighter leading-tight text-white">{problem.headline}</h2>
          <p className="mt-3.5 text-[15px] text-white/60">{problem.lede}</p>
        </div>

        <ul className="flex flex-col gap-4">
          {problem.items.map((item, i) => (
            <li
              key={item.mark}
              className={`grid grid-cols-[auto_1fr] gap-4 pb-4 ${
                i < problem.items.length - 1 ? "border-b border-white/10" : ""
              }`}
            >
              <span className="text-sm font-bold text-brand-green">{item.mark}</span>
              <div>
                <h4 className="mb-1 text-[17px] font-semibold text-white">{item.title}</h4>
                <p className="text-[14.5px] text-white/60">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
