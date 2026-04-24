import { NavLink } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { groupedTopics } from "@/data/topics"
import { BookOpenIcon, HomeIcon, SparklesIcon } from "lucide-react"

export function AppSidebar() {
  const groups = groupedTopics()
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col gap-1 px-2 py-2">
          <span className="font-eyebrow text-[10px] text-gold">Denison · CS 271</span>
          <span className="font-display text-xl leading-tight text-white">
            Data Structures
            <span className="text-gold"> Live</span>
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-eyebrow text-gold">Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/" end>
                    <HomeIcon data-icon="inline-start" />
                    Home
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/how-this-was-built">
                    <SparklesIcon data-icon="inline-start" />
                    How this was built
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {groups.map((g) => (
          <SidebarGroup key={g.category}>
            <SidebarGroupLabel className="font-eyebrow text-gold">{g.category}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.topics.map((t) => (
                  <SidebarMenuItem key={t.slug}>
                    <SidebarMenuButton asChild>
                      <NavLink to={`/topic/${t.slug}`}>
                        <BookOpenIcon data-icon="inline-start" />
                        <span className="flex-1">{t.title}</span>
                        <span className="font-eyebrow text-[9px] opacity-70">
                          {String(t.id).padStart(2, "0")}
                        </span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-1 font-eyebrow text-[10px] text-white/70">
          The Hill · Big Red
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
