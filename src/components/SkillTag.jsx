const tones = {
  strong: "bg-sage-soft text-sage-dark border-sage-soft",
  weak: "bg-[#FBF1DE] text-[#9a7a2c] border-[#F0DFB4]",
  missing: "bg-peach text-[#a15a35] border-peach",
  neutral: "bg-[#F1EEE5] text-ink border-border",
};

export default function SkillTag({ children, tone = "neutral" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-sm ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
