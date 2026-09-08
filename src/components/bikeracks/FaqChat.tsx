import { pdpFaqs } from "@/lib/verticalRackPdp";

// Same real FAQ content as the accordion elsewhere in the app, presented
// as an iMessage-style conversation instead — gray "received" bubble for
// the customer's question, blue "sent" bubble for JB Racks' answer.
export function FaqChat() {
  return (
    <section className="border-t border-brand-line py-12 sm:py-14">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="mx-auto mb-9 max-w-[62ch] text-center">
          <div className="mb-2.5 text-sm font-bold text-brand-green-dark">QUESTIONS</div>
          <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tighter leading-[1.14] text-brand-black">
            Main questions we get
          </h2>
        </div>

        <div className="mx-auto flex max-w-[560px] flex-col gap-5">
          {pdpFaqs.map((faq) => (
            <div key={faq.question}>
              <div className="flex justify-start">
                <div className="imsg-bubble imsg-bubble-left max-w-[85%] rounded-[20px] bg-[#E9E9EB] px-4 py-3 text-brand-black sm:max-w-[75%]">
                  <div className="mb-0.5 text-xs font-bold text-brand-black/50">Customer</div>
                  <p className="text-[15px] leading-snug">{faq.question}</p>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <div className="imsg-bubble imsg-bubble-right max-w-[85%] rounded-[20px] bg-[#0B84FF] px-4 py-3 text-white sm:max-w-[75%]">
                  <div className="mb-0.5 text-xs font-bold text-white/70">JB Racks</div>
                  <p className="text-[15px] leading-snug">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
