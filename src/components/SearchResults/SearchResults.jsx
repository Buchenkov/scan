import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../styles/SearchResults.css';
import GeneralSummaryTable from './GeneralSummaryTable/GeneralSummaryTable';
import ArticleCards from './ArticleCards/ArticleCards';
import search_results_large_picture from '../../assets/search_results_large_picture.svg';

const SearchResults = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [searchData, setSearchData] = useState(null);
  const [documentsData, setDocumentsData] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isAllDataLoaded, setIsAllDataLoaded] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth');
    }
  }, [isLoggedIn, navigate]);

  const fetchSearchResults = useCallback(async () => {
    const searchParams = location.state?.searchParams;
    if (!searchParams) {
      console.error('Search parameters are missing.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      const histogramResponse = await fetch('https://gateway.scan-interfax.ru/api/v1/objectsearch/histograms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(searchParams),
        credentials: 'omit',
      });

      if (!histogramResponse.ok) {
        throw new Error(`HTTP error! status: ${histogramResponse.status}`);
      }

      const histogramData = await histogramResponse.json();

      const publicationIdsResponse = await fetch('https://gateway.scan-interfax.ru/api/v1/objectsearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(searchParams),
        credentials: 'omit',
      });

      if (!publicationIdsResponse.ok) {
        throw new Error(`HTTP error! status: ${publicationIdsResponse.status}`);
      }

      const publicationIdsData = await publicationIdsResponse.json();
      const publicationIds = publicationIdsData.items.map(item => item.encodedId);
      console.log("количество публикаций:", publicationIds.length);

      if (publicationIds.length === 0) {
        console.error('No publication IDs found.');
        setIsError(true);
        setIsLoading(false);
        return;
      }

      const documentsResponse = await fetch('https://gateway.scan-interfax.ru/api/v1/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ ids: publicationIds }),
        credentials: 'omit',
      });

      console.log("DOCUMENT - ", documentsResponse);
      console.log("PUBLICATION IDS - ", publicationIdsData);
      console.log("publicationIds IDS - ", publicationIds);

      if (!documentsResponse.ok) {
        throw new Error(`HTTP error! status: ${documentsResponse.status}`);
        console.log("количество полученных id публикаций:", publicationIds.length);
      }

      const documentsData = await documentsResponse.json();
      setSearchData(histogramData);
      setDocumentsData(documentsData);
      setIsAllDataLoaded(true);
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error.message);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [location.state?.searchParams]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  return (
    <div className="search-results-content">
      {isLoading && (
        <>
          <div className="search-results-title-block">
            <div className="search-results-title-text">
              <h1 className="h1-search-results-page">Ищем. Скоро будут результаты</h1>
              <p className="p-search-results-page-title-block">Поиск может занять некоторое время, просим сохранять терпение.</p>
            </div>
            <img className="search-results-large-picture" src={search_results_large_picture} alt="Search results picture" />
          </div>
          <GeneralSummaryTable searchData={searchData} isLoading={isLoading} setIsLoading={setIsLoading} />
        </>
      )}
      {!isLoading && isError && (
        <GeneralSummaryTable searchData={searchData} isLoading={isLoading} setIsLoading={setIsLoading} isError={isError} />
      )}
      {!isLoading && !isError && isAllDataLoaded && (
        <>
          <GeneralSummaryTable searchData={searchData} isLoading={isLoading} setIsLoading={setIsLoading} isError={isError} />
          <ArticleCards documentsData={documentsData} />
        </>
      )}
    </div>
  );
};

export default SearchResults;



// 1. Импорты

// Импортируются необходимые модули и компоненты из React, React Router и контекста AuthContext.
// Импортируются стили и другие компоненты, такие как GeneralSummaryTable и ArticleCards.
// Импортируется изображение search_results_large_picture.

// 2. Определение компонента

// Компонент SearchResults определен как функциональный компонент с помощью стрелочной функции.

// 3. Использование хуков

// Используются хуки useLocation и useNavigate из React Router для работы с маршрутами.
// Используется хук useAuth из контекста AuthContext для получения информации об аутентификации пользователя.
// Используются хуки useState для управления состояниями isLoading, searchData, documentsData, isError и isAllDataLoaded.

// 4. Обработка аутентификации

// В useEffect проверяется, аутентифицирован ли пользователь. Если нет, то происходит перенаправление на страницу аутентификации (/auth).

// 5. Загрузка данных

// В useEffect определена асинхронная функция fetchSearchResults, которая выполняет несколько запросов к API для получения данных поиска и содержимого документов.
// Сначала проверяется наличие параметров поиска (searchParams) в состоянии маршрута (location.state).
// Затем выполняется запрос к API для получения гистограммы результатов поиска.
// После этого выполняется запрос для получения идентификаторов публикаций, соответствующих параметрам поиска.
// Далее выполняется запрос для получения содержимого документов по полученным идентификаторам публикаций.
// Полученные данные сохраняются в соответствующих состояниях (searchData и documentsData).
// В случае ошибки устанавливается состояние isError.
// После выполнения всех запросов состояние isLoading устанавливается в false.

// 6. Рендеринг компонента

// В зависимости от состояний isLoading, isError и isAllDataLoaded компонент отображает различный контент.
// Если isLoading равно true, отображается заголовок "Ищем. Скоро будут результаты" и компонент GeneralSummaryTable.
// Если isLoading равно false и isError равно true, отображается компонент GeneralSummaryTable с сообщением об ошибке.
// Если isLoading равно false, isError равно false и isAllDataLoaded равно true, отображаются компоненты GeneralSummaryTable и ArticleCards с полученными данными.

// 7. Экспорт компонента

// Компонент SearchResults экспортируется по умолчанию.

// Использование useCallback:

// Функция fetchSearchResults была оборачена в useCallback, чтобы избежать ненужных повторных рендеров и оптимизировать производительность. Теперь функция будет пересоздаваться только при изменении location.state?.searchParams.
// Разделение эффектов:

// Вызов fetchSearchResults был вынесен в отдельный useEffect, что упрощает чтение и понимание кода.
// Проверка isAllDataLoaded:

// Добавлена проверка isAllDataLoaded перед рендерингом компонентов GeneralSummaryTable и ArticleCards. Это гарантирует, что они будут отображаться только после загрузки всех необходимых данных.
// Установка isAllDataLoaded:

// Состояние isAllDataLoaded устанавливается в true после успешной загрузки всех данных.