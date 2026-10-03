import { CalendarDays, MapPin, UsersRound, Mic } from "lucide-react";
import type { InfoItem } from "@/components/shared";

export const aboutInfo: InfoItem[] = [
  { icon: CalendarDays, title: "Date", description: "À confirmer" },
  { icon: MapPin, title: "Lieu", description: "Niamey, Niger" },
  { icon: UsersRound, title: "Participants", description: "+1000 attendus" },
  { icon: Mic, title: "Sessions", description: "Conférences, formations, réseautage, recrutement" },
];
