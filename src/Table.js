import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import "./index.css";

import axios from "axios";

const Table = () => {
  // Initialisation des états
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    // Charger les données depuis l'API
    axios
      .get("http://localhost:8886/stocks/all") // Remplacez par votre URL d'API
      .then((response) => {
        // Transformer les données en un format adapté
        const data = response.data.map((item) => ({
          id: item.id,
          name: item.article.designation_article, // Nom de l'article
          depot: item.depot.nomDepot, // Nom du dépôt
          date: item.datePeremption, // Date de péremption
          quantite: item.qte, // Quantité
        }));
        setArticles(data); // Mettre à jour l'état avec les articles
        setLoading(false); // Arrêter l'état de chargement
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des données :", error);
        setError("Erreur lors du chargement des données"); // Afficher une erreur
        setLoading(false); // Arrêter l'état de chargement
      });
  }, []);

  // Si les données sont en cours de chargement
  if (loading) return <p>Chargement des données...</p>;
  // Si une erreur survient
  if (error) return <p>{error}</p>;

  const filteredArticles = articles.filter((article) =>
    article.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const removeArticle = (id) => {
    axios
      .delete(`http://localhost:8886/stocks/delete/${id}`) // Remplacez par l'URL correcte pour la suppression
      .then(() => {
        console.log("Article supprimé avec succès.");
        refreshArticles(); // Met à jour la liste des articles après la suppression
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'article :", error);
        setError("Erreur lors de la suppression de l'article");
      });
  };

  const updateQuantity = (id, change) => {
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.id === id
          ? { ...article, quantite: Math.max(article.quantite + change, 0) }
          : article
      )
    );
  };

  const deleteArticle = (id) => {
    setArticles((prevArticles) =>
      prevArticles.filter((article) => article.id !== id)
    );
  };

  const handleOpenModal = () => {
    setSelectedArticle(null);
    setIsModalOpen(!isModalOpen);
  };

  const getArticleById = (id) => {
    axios
      .get(`http://localhost:8886/stocks/get/${id}`) // Remplacez par l'URL correcte pour récupérer un article par son ID
      .then((response) => {
        console.log("Article récupéré avec succès :", response.data);
        // Mettre à jour l'état avec l'article sélectionné
        setSelectedArticle({
          id: response.data.id,
          name: response.data.articleNom,
          depot: response.data.depotNom,
          date: response.data.datePeremption,
          quantite: response.data.qte,
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération de l'article :", error);
        setError("Erreur lors de la récupération de l'article");
      });
  };

  const toggleEditModal = (articleID) => {
    console.log("articleID", articleID);
    getArticleById(articleID);
    setIsModalOpen(!isModalOpen);
  };

  const refreshArticles = () => {
    setLoading(true);
    axios
      .get("http://localhost:8886/stocks/all")
      .then((response) => {
        const data = response.data.map((item) => ({
          id: item.id,
          name: item.article.designation_article,
          depot: item.depot.nomDepot,
          date: item.datePeremption,
          quantite: item.qte,
        }));
        setArticles(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des données :", error);
        setError("Erreur lors du chargement des données");
        setLoading(false);
      });
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="flex justify-center" style={{ paddingTop: "1.5rem" }}>
      <div className="w-[70%]">
        <div
          className="flex items-center justify-center"
          style={{ paddingBottom: "1.5rem" }}
        >
          <img src="/logo_clinisys.png" />
        </div>

        <div className="flex items-center justify-between pb-4 gap-4 w-full">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Liste de stock
          </h1>
          <div className="relative flex-1 max-w-[700px] mx-4">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Rechercher un Article"
            />
          </div>
          <button
            onClick={handleOpenModal}
            className="text-sm font-medium px-3 py-1.5 rounded-lg bg-blue-700 text-white"
            type="button"
          >
            Ajouter un Article
          </button>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Article
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Quantite
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Depot
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Date Peremption
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredArticles.map((article) => (
                <tr
                  key={article.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {article.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-2.5 py-1"
                      style={{ width: "fit-content", display: "inline" }}
                    >
                      {article.quantite}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-center">
                    {article.depot}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-2.5 py-1"
                      style={{ width: "fit-content", display: "inline" }}
                    >
                      {formatDate(article.date)}
                    </div>
                  </td>
                  <td className="flex px-6 py-4 text-center justify-center">
                    <button
                      className="font-medium text-orange-600 dark:text-orange-500 hover:underline"
                      onClick={() => toggleEditModal(article.id)}
                      title="Modifier"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 3.487a2.25 2.25 0 0 1 3.182 3.182L7.129 19.584l-4.11.913a.75.75 0 0 1-.91-.91l.913-4.11 12.84-12.84z"
                        />
                      </svg>
                    </button>

                    <button
                      className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      onClick={() => removeArticle(article.id)}
                      title="Effacer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 9v10c0 1.105.895 2 2 2h8c1.105 0 2-.895 2-2V9M4 6h16M10 6V4h4v2"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          toggleModal={toggleModal} // Pass toggleModal correctly
          selectedArticle={selectedArticle}
          refreshArticles={refreshArticles}
        />
      )}
    </div>
  );
};

export default Table;
