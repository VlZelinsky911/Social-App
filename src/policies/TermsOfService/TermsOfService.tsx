import React from "react";
import "./TermsOfService.scss";

const TermsOfService: React.FC = () => {
  return (
<div className="terms-container">
      <h1>Умови використання</h1>
      <p>Останнє оновлення: 22 березня 2025</p>

      <section>
        <h2>1. Вступ</h2>
        <p>
          Ласкаво просимо! Використовуючи наш сервіс, ви погоджуєтесь із цими умовами.
          Якщо ви не згодні, будь ласка, не використовуйте платформу.
        </p>
      </section>

      <section>
        <h2>2. Обліковий запис</h2>
        <p>
          Ви повинні бути не молодші 13 років, щоб створити акаунт. Ви несете відповідальність
          за безпеку свого облікового запису.
        </p>
      </section>

      <section>
        <h2>3. Використання сервісу</h2>
        <p>
          Заборонено публікувати незаконний, образливий чи непристойний контент.
          Ми залишаємо за собою право блокувати користувачів, які порушують правила.
        </p>
      </section>

      <section>
        <h2>4. Зміни в умовах</h2>
        <p>
          Ми можемо періодично оновлювати ці умови. Якщо ви продовжуєте використовувати сервіс
          після змін, це означає вашу згоду з оновленнями.
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

export default TermsOfService;