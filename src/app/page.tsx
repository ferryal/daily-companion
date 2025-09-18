import { Chat } from "@/components/Chat";
import { StatsBar } from "@/components/StatsBar";

export default function Home() {
  return (
    <div className="h-screen bg-background lg:bg-muted/20">
      {/* Mobile-first container, centered on web */}
      <div className="h-full max-w-md mx-auto bg-background flex flex-col lg:shadow-2xl lg:border lg:border-border/20">
        {/* Mobile-Native Stats Bar */}
        <StatsBar />

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <Chat />
        </div>
      </div>
    </div>
  );
}
