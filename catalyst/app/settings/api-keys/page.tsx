import SettingsSectionHeader from "../../components/settings/SettingsSectionHeader";
import ApiKeysPanel from "../../components/settings/api-keys/ApiKeysPanel";

export default function ApiKeysSettings() {
  return (
    <>
      <SettingsSectionHeader 
        title="API Management" 
        description="Integrate your custom LLM provider keys to enable higher limits and premium models. If not set, system defaults will be used."
      />
      
      <div className="flex flex-col gap-10 animate-fadeIn">
        <section>
          <ApiKeysPanel />
        </section>
      </div>
    </>
  );
}
