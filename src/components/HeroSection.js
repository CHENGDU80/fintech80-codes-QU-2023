import Link from 'next/link'; // Import Link from next/link

// HeroSection.js
const HeroSection = () => {
    return (
        <div>
        <section className="section1">
            <div className="text-section"> 
                <h1 class="h1-hero-section">Discover PathFinder, Your News Intelligence Companion</h1>
                <p class="p-hero-section">Introducing PathFinder – the cutting-edge system designed to monitor key news, 
                    providing a comprehensive perspective on its impact, 
                    and helping analysts uncover valuable insights amidst the constant stream of information.</p>
                <Link href="/auth/login" passHref> {/* Add Link component with href prop */}
                <button>Get Started</button>
                 </Link> {/* Close Link component */}
            </div>
            <img src="/images/entrepreneur.jpg" alt="Descriptive alt text" className="herosection-gif"/>
        </section>
        <section className="section2">
            <img src="/images/money.jpg" alt="Descriptive alt text" className="herosection-gif"/>
            <div className="text-section">
                
                <h1 class="h1-hero-section">Time is Money</h1>
                <p class="p-hero-section">Missing out on key news can result in significant losses or missed opportunities.</p>
                <button>Learn More</button>
            </div>
        </section>
        </div>
    );
};

export default HeroSection;
