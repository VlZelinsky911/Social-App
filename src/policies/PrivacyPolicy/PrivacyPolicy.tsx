import React from "react";
import "./PrivacyPolicy.scss";

const PrivacyPolicy: React.FC = () => {
  return (
	 <div className="privacy-container">
      <h1>Політика конфіденційності</h1>
      <p>Останнє оновлення: 22 березня 2025</p>

      <section>
        <h2>1. Які дані ми збираємо?</h2>
        <p>
				Ми можемо збирати інформацію, яку ви надаєте при реєстрації, включаючи
				ім’я, email, фото профілю тощо.
        </p>
      </section>

      <section>
        <h2>2. Як ми використовуємо ваші дані?</h2>
        <p>
				Дані використовуються для забезпечення роботи сервісу, покращення
        функціоналу та персоналізації досвіду користувачів.
        </p>
      </section>

      <section>
        <h2>3. Чи передаємо ми ваші дані третім особам?</h2>
        <p>
				Ми не продаємо ваші дані. Однак у певних випадках можемо передавати
				їх нашим партнерам для забезпечення функціонування сервісу.
        </p>
      </section>

      <section>
        <h2>4. Як ви можете контролювати свої дані?</h2>
        <p>
				Ви можете оновлювати або видаляти свої дані у налаштуваннях акаунта
				або зв’язавшись із нами.
        </p>
      </section>

      <footer>
        <p>
          Якщо у вас є питання, зв'яжіться з нами: 
          <a href="mailto:support@example.com"> support@example.com</a>
        </p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;