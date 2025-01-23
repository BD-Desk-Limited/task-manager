import "./globals.css";
import { ProjectProvider } from "../../contexts/ProjectContext";
import Authenticate from "@/components/auth/Authentication";
export const metadata = {
  title: "Tasks-Manager for BD-Desk",
  description: "Customized task management platform for BD-Desk",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-brand_blue">
        <ProjectProvider>
          <Authenticate>
            {children}
          </Authenticate>
        </ProjectProvider>
      </body>
    </html>
  );
}
