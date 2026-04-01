import SettingsSectionHeader from "../../components/settings/SettingsSectionHeader";

export default function ApiKeysSettings() {
  return (
    <>
      <SettingsSectionHeader 
        title="API Management" 
        description="Integrate your custom LLM provider keys to enable higher limits and premium models."
      />
      <div className="flex flex-col gap-6 animate-fadeIn">
        <p className="text-slate-400">API key management coming in Chunk 4.</p>
      </div>
    </>
  );
}
