import './globals.css'
import Nav from "@/components/Nav";

export const metadata = {
    title: "Misconduct Complain App",
    description: "Get Information You Need When Facing Law Enforcement Misconduct."
}

/*A root layout is the top-most layout in the root app directory. 
It is used to define the <html> and <body> tags and other globally shared UI.

Layout components should accept and use a children prop. During rendering, 
children will be populated with the route segments the layout is wrapping.
*/


const RootLayout = ({children}) => {
  return (
    <html lang='en'>
        <body>
          <main className="app">
            <Nav />
            {children}
          </main>
        </body>
    </html>
  )
}

export default RootLayout;
