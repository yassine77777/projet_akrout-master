import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker"; // Import the DatePicker component from react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import the default styles for the DatePicker
import { registerLocale, setLocale } from "react-datepicker"; // Import locale registration and setting
import fr from "date-fns/locale/fr"; // Import the French locale
import axios from "axios";
import Swal from "sweetalert2";

// Register the French locale with react-datepicker
registerLocale("fr", fr);

const Modal = ({ toggleModal, selectedArticle, refreshArticles }) => {
  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    article: "",
    depot: "",
    date: "",
    quantite: 0,
  });

  // État pour la date sélectionnée
  const [selectedDate, setSelectedDate] = useState(null);
  const [depots, setDepots] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8886/depots/all") // Replace with your actual API endpoint
      .then((response) => {
        setDepots(response.data); // Set depots to the response data
      })
      .catch((error) => {
        console.error("Error fetching depots:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8886/articles/all") // Replace with your actual API endpoint
      .then((response) => {
        setArticles(response.data); // Set depots to the response data
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
      });
  }, []);

  // Mise à jour de formData et selectedDate lorsque selectedArticle change
  useEffect(() => {
    if (selectedArticle) {
      console.log("Modal selectedArticle:", selectedArticle);

      // Mettre à jour les données du formulaire avec les informations de l'article sélectionné
      setFormData({
        article: selectedArticle.name,
        depot: selectedArticle.depot,
        date: selectedArticle.date,
        quantite: selectedArticle.quantite,
      });

      // Définir directement selectedDate à partir de selectedArticle.date
      setSelectedDate(new Date(selectedArticle.date));
    }
    // Convert to Date object
  }, [selectedArticle]);

  // Log de selectedDate à chaque changement
  useEffect(() => {
    console.log("selectedDate:", selectedDate);
  }, [selectedDate]);

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value, // Mise à jour des données du formulaire
    }));

    console.log("fel update chtara", formData);
  };

  const updateArticle = async (e) => {
    e.preventDefault();

    // Construire les données à envoyer pour la mise à jour
    const dataToSend = {
      articleId: formData.article, // Assurez-vous que `article` correspond bien à l'id de l'article
      depotId: formData.depot,
      datePeremption: formData.date, // Format compatible avec l'API
      qte: formData.quantite,
    };

    try {
      // Appeler l'API pour mettre à jour l'article
      const response = await axios.put(
        `http://localhost:8886/stocks/update/${selectedArticle.id}`, // Assurez-vous que `selectedArticle.id` est correct
        dataToSend
      );

      console.log("Article mis à jour avec succès :", response.data);
      refreshArticles(); // Rafraîchir la liste des articles

      // Fermer la modale
      toggleModal();

      // Afficher un message de succès avec SweetAlert
      Swal.fire({
        title: "Succès!",
        text: "L'article a été mis à jour avec succès.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'article :", error);

      // Afficher un message d'erreur avec SweetAlert en cas d'échec
      Swal.fire({
        title: "Erreur!",
        text: "Une erreur est survenue lors de la mise à jour de l'article. Veuillez réessayer.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construire les données à envoyer
    const dataToSend = {
      articleId: formData.article, // Assurez-vous que `article` correspond bien à l'id de l'article
      depotId: formData.depot,
      datePeremption: formData.date, // Format compatible avec l'API
      qte: formData.quantite,
    };

    try {
      // Logique pour ajouter un nouvel article
      const response = await axios.post(
        "http://localhost:8886/stocks/save",
        dataToSend
      );

      console.log("Article ajouté avec succès :", response.data);
      refreshArticles();

      // Fermer la modale
      toggleModal();

      // Afficher un message de succès avec SweetAlert
      Swal.fire({
        title: "Succès!",
        text: "Le stock a été ajouté avec succès.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout des données :", error);
      Swal.fire({
        title: "Erreur!",
        text: "Une erreur est survenue. Veuillez réessayer.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const formatFrenchDate = (date) => {
    if (!date) return "";
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return new Intl.DateTimeFormat("fr-FR", options).format(date);
  };

  return (
    <>
      {/* Main modal */}
      <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden md:inset-0">
        <div
          className="relative p-4 w-full max-h-full"
          style={{ maxWidth: "30rem" }}
        >
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedArticle
                  ? "Modifier un Article"
                  : "Ajouter un Nouveau Article"}
              </h3>
              <button
                type="button"
                onClick={toggleModal}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                  aria-hidden="true"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {/* Modal body */}
            <form
              onSubmit={selectedArticle ? updateArticle : handleSubmit}
              className="p-4 md:p-5"
            >
              <div className="grid gap-4 mb-4 grid-cols-2">
                {/* Article */}
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Articles
                  </label>
                  <select
                    id="article"
                    name="article"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={formData.article}
                    onChange={handleInputChange}
                  >
                    {/* If formData.depot is not null, show it as a disabled option */}
                    {formData.article ? (
                      <option value={formData.article} disabled>
                        {formData.article}
                      </option>
                    ) : (
                      // Default placeholder option
                      <option value="" disabled>
                        Sélectionnez un article
                      </option>
                    )}
                    {articles.map((article) => (
                      <option key={article.id} value={article.id}>
                        {`${article.designation_article}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Peremption */}
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="date"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Date Peremption
                  </label>
                  <DatePicker
                    placeholderText="Sélectionnez une date"
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setFormData((prevState) => ({
                        ...prevState,
                        date: date,
                      }));
                    }}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    locale="fr" // Set the locale to French
                    dateFormat="dd MMMM yyyy" // Set the date format
                  />
                </div>

                {/* Quantite */}
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="quantite"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Quantite
                  </label>
                  <input
                    type="number"
                    name="quantite"
                    id="quantite"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={formData.quantite}
                    onChange={handleInputChange}
                    required
                    min={0}
                  />
                </div>

                {/* Depot */}
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="depot"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Depot
                  </label>
                  <select
                    id="depot"
                    name="depot"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    value={formData.depot}
                    onChange={handleInputChange}
                  >
                    {/* If formData.depot is not null, show it as a disabled option */}
                    {formData.depot ? (
                      <option value={formData.depot} disabled>
                        {formData.depot}
                      </option>
                    ) : (
                      // Default placeholder option
                      <option value="" disabled>
                        Sélectionnez un dépôt
                      </option>
                    )}

                    {/* Render the list of depots */}
                    {depots.map((depot) => (
                      <option key={depot.id} value={depot.id}>
                        {`${depot.nomDepot}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="border-b rounded-t dark:border-gray-600"></div>
              <div
                className="pt-[15px] flex justify-end"
                style={{ paddingTop: "15px" }}
              >
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  <svg
                    className="me-1 -ms-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {selectedArticle ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
