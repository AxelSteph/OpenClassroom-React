import FeatureItem from "../components/FeatureItem";

import "../styles/Home.css";

function Home() {
  return (
    <>
      <main>
        <section className="hero">
          <div className="hero-content">
            <h2>
              No fees.
              <br />
              No minimum deposit.
              <br />
              High interest rates.
            </h2>

            <p>
              Open a savings account with
              <br />
              Argent Bank today!
            </p>
          </div>
        </section>

        <section className="features">
          <FeatureItem
            image="/src/assets/icon-chat.png"
            title="You are our #1 priority"
            text="Need to talk to a representative? You can get in touch through our 24/7 chat or through a phone call in less than 5 minutes."
          />

          <FeatureItem
            image="/src/assets/icon-money.png"
            title="More savings means higher rates"
            text="The more you save with us, the higher your interest rate will be!"
          />

          <FeatureItem
            image="/src/assets/icon-security.png"
            title="Security you can trust"
            text="We use top of the line encryption to make sure your data and money is always safe."
          />
        </section>
      </main>
    </>
  );
}

export default Home;