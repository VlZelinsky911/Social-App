import "./NewsCategories.scss";

export const NewsCategories: React.FC = () => (
	<div className="news-categories">
		{["Стрічка", "Акції", "Напарники"].map((category) => (
			<button key={category} className="btn-category">
				<h2>{category}</h2>
			</button>
		))}
	</div>
);

