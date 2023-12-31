import Footer from '../components/footer/Footer'
import Header from '../components/Header'
import Menu from '../components/menu/Menu'
import HowToJoinIra from '../components/HowToJoinIra'
import JoinMovement from '../components/JoinMovement'
import HelpIra from '../components/HelpIra'
import NewsLetter from '../components/NewsLetter'
import Team from '../components/Team'

export default function Home() {
  return (
    <div className="LP">
      <div className="div">

        <JoinMovement/>
        
        <HelpIra/>
        
        <NewsLetter/>

        <HowToJoinIra/>
        
        <Team/>

        <Header/>
        
        <Menu/>

        <Footer/>
        
        
      </div>
    </div>

     )
}
