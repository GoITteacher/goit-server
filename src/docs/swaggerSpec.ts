const paginationParameters = [
  {
    name: 'page',
    in: 'query',
    schema: { type: 'integer', minimum: 1, default: 1 },
    description:
      'Page number (defaults to 1, must be greater than or equal to 1).',
  },
  {
    name: 'perPage',
    in: 'query',
    schema: { type: 'integer', minimum: 1, default: 10 },
    description: 'Number of items per page (defaults to 10).',
  },
  {
    name: 'sortField',
    in: 'query',
    schema: { type: 'string' },
    description: 'Field to sort by (defaults to createdAt).',
  },
  {
    name: 'sortOrder',
    in: 'query',
    schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
    description: 'Sorting direction (asc or desc).',
  },
];

const newsFilterParameters = [
  {
    name: 'title',
    in: 'query',
    schema: { type: 'string' },
    description: 'Partial match against the title.',
  },
  {
    name: 'category',
    in: 'query',
    schema: { type: 'string' },
    description: 'Category identifier.',
  },
  {
    name: 'source',
    in: 'query',
    schema: { type: 'string' },
    description: 'Filter by the news source.',
  },
  {
    name: 'tags',
    in: 'query',
    schema: { type: 'string' },
    description: 'Comma-separated tags.',
  },
];

const songFilterParameters = [
  { name: 'title', in: 'query', schema: { type: 'string' } },
  { name: 'artist', in: 'query', schema: { type: 'string' } },
  { name: 'genre', in: 'query', schema: { type: 'string' } },
  { name: 'language', in: 'query', schema: { type: 'string' } },
  { name: 'label', in: 'query', schema: { type: 'string' } },
  { name: 'releaseYear', in: 'query', schema: { type: 'integer' } },
];

const carFilterParameters = [
  { name: 'make', in: 'query', schema: { type: 'string' } },
  { name: 'model', in: 'query', schema: { type: 'string' } },
  { name: 'color', in: 'query', schema: { type: 'string' } },
  { name: 'fuelType', in: 'query', schema: { type: 'string' } },
  { name: 'year', in: 'query', schema: { type: 'integer' } },
  { name: 'price', in: 'query', schema: { type: 'number' } },
];

const movieFilterParameters = [
  { name: 'title', in: 'query', schema: { type: 'string' } },
  { name: 'director', in: 'query', schema: { type: 'string' } },
  { name: 'genre', in: 'query', schema: { type: 'string' } },
  { name: 'language', in: 'query', schema: { type: 'string' } },
  { name: 'releaseYear', in: 'query', schema: { type: 'integer' } },
  { name: 'rating', in: 'query', schema: { type: 'number' } },
];

const studentFilterParameters = [
  { name: 'firstName', in: 'query', schema: { type: 'string' } },
  { name: 'lastName', in: 'query', schema: { type: 'string' } },
  { name: 'major', in: 'query', schema: { type: 'string' } },
  { name: 'cohortYear', in: 'query', schema: { type: 'integer' } },
  { name: 'gpa', in: 'query', schema: { type: 'number' } },
  { name: 'enrolled', in: 'query', schema: { type: 'boolean' } },
];

const lessonFilterParameters = [
  { name: 'title', in: 'query', schema: { type: 'string' } },
  { name: 'subject', in: 'query', schema: { type: 'string' } },
  { name: 'level', in: 'query', schema: { type: 'string' } },
  { name: 'teacher', in: 'query', schema: { type: 'string' } },
  { name: 'durationMinutes', in: 'query', schema: { type: 'integer' } },
];

const protectedNewsFilterParameters = [
  {
    name: 'topic',
    in: 'query',
    schema: { type: 'string' },
    description: 'Partial match against the topic.',
  },
  {
    name: 'type',
    in: 'query',
    schema: {
      type: 'string',
      enum: ['updates', 'news', 'testimonials', 'video stories'],
    },
    description: 'News type.',
  },
  {
    name: 'typeAccount',
    in: 'query',
    schema: { type: 'string', enum: ['freeUser', 'paidUser', 'agencyUser'] },
  },
  {
    name: 'userId',
    in: 'query',
    schema: { type: 'string' },
    description: 'Creator user ID.',
  },
];

const todosFilterParameters = [
  {
    name: 'completed',
    in: 'query',
    schema: { type: 'boolean' },
    description: 'Filter by completion status.',
  },
  {
    name: 'priority',
    in: 'query',
    schema: { type: 'string', enum: ['low', 'medium', 'high'] },
    description: 'Priority level.',
  },
  {
    name: 'category',
    in: 'query',
    schema: { type: 'string' },
    description: 'Partial match against the category name.',
  },
  {
    name: 'title',
    in: 'query',
    schema: { type: 'string' },
    description: 'Partial match against the title.',
  },
  {
    name: 'tag',
    in: 'query',
    schema: { type: 'string' },
    description: 'Single tag filter.',
  },
  {
    name: 'dueBefore',
    in: 'query',
    schema: { type: 'string', format: 'date-time' },
    description: 'Include todos due on or before this timestamp.',
  },
  {
    name: 'dueAfter',
    in: 'query',
    schema: { type: 'string', format: 'date-time' },
    description: 'Include todos due on or after this timestamp.',
  },
];

const paginatedSchema = (itemRef: string, listKey = 'items') => ({
  type: 'object',
  properties: {
    page: { type: 'integer' },
    perPage: { type: 'integer' },
    totalPages: { type: 'integer' },
    totalItems: { type: 'integer' },
    hasNextPage: { type: 'boolean' },
    hasPreviousPage: { type: 'boolean' },
    [listKey]: {
      type: 'array',
      items: { $ref: `#/components/schemas/${itemRef}` },
    },
  },
});

const buildListResponses = (schemaRef: string) => ({
  200: {
    description: 'Paginated response',
    content: {
      'application/json': {
        schema: { $ref: `#/components/schemas/${schemaRef}` },
      },
    },
  },
});

const buildItemResponse = (schemaRef: string) => ({
  200: {
    description: 'Requested item',
    content: {
      'application/json': {
        schema: { $ref: `#/components/schemas/${schemaRef}` },
      },
    },
  },
});

const buildCreateResponse = (schemaRef: string) => ({
  201: {
    description: 'Created',
    content: {
      'application/json': {
        schema: { $ref: `#/components/schemas/${schemaRef}` },
      },
    },
  },
});

const buildRequestBody = (schemaRef: string) => ({
  required: true,
  content: {
    'application/json': {
      schema: { $ref: `#/components/schemas/${schemaRef}` },
    },
  },
});

const pathIdParam = (name: string, description: string) => ({
  name,
  in: 'path',
  required: true,
  schema: { type: 'string' },
  description,
});

const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'GoIt Catalog API',
    version: '1.0.0',
    description:
      'Public catalog endpoints with pagination, filtering, and CRUD operations.',
  },
  servers: [
    {
      url: 'https://q10gsl5s9d.execute-api.us-east-1.amazonaws.com/',
      description: 'Main server',
    },
    { url: '/', description: 'Local server' },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'Login, registration, token refresh, and session info',
    },
    {
      name: 'News',
      description: 'Authenticated news posts created by registered users',
    },
    {
      name: 'Tasks',
      description: 'User-managed task list requiring authorization',
    },
    {
      name: 'Notes',
      description: 'Personal notes that belong to the authenticated user',
    },
    {
      name: 'Todos',
      description: 'Public todo list that does not require authentication',
    },
    {
      name: 'Catalog News',
      description: 'News stories available in the unauthenticated catalog',
    },
    { name: 'Songs', description: 'Music entries in the public catalog' },
    {
      name: 'Cars',
      description: 'Car listings shared through the public catalog',
    },
    {
      name: 'Movies',
      description: 'Movie records exposed without authentication',
    },
    {
      name: 'Students',
      description: 'Student directory data in the public catalog',
    },
    {
      name: 'Lessons',
      description: 'Lesson plans and resources available publicly',
    },
  ],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        tags: ['Authentication'],
        requestBody: buildRequestBody('AuthRegisterInput'),
        responses: {
          201: {
            description: 'Registered user with tokens',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthTokensWithUser' },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Log in with email and password',
        tags: ['Authentication'],
        requestBody: buildRequestBody('AuthLoginInput'),
        responses: {
          200: {
            description: 'Authenticated user with tokens',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthTokensWithUser' },
              },
            },
          },
        },
      },
    },
    '/auth/refresh': {
      post: {
        summary: 'Refresh tokens using the refresh cookie',
        tags: ['Authentication'],
        responses: {
          200: {
            description: 'New tokens and user profile',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthTokensWithUser' },
              },
            },
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        summary: 'Log out and clear refresh/access cookies',
        tags: ['Authentication'],
        responses: {
          204: { description: 'Logged out' },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: "Return the authenticated user's profile",
        tags: ['Authentication'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Current user',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserResponse' },
              },
            },
          },
        },
      },
    },
    '/news': {
      get: {
        summary: 'List news posts created by the authenticated user',
        tags: ['News'],
        security: [{ bearerAuth: [] }],
        parameters: [...paginationParameters, ...protectedNewsFilterParameters],
        responses: {
          200: {
            description: 'Paginated news list',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedNews' },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a news post',
        tags: ['News'],
        security: [{ bearerAuth: [] }],
        requestBody: buildRequestBody('NewsInput'),
        responses: {
          201: {
            description: 'Created news post',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/News' },
              },
            },
          },
        },
      },
    },
    '/news/{newsId}': {
      delete: {
        summary: 'Delete a news post owned by the authenticated user',
        tags: ['News'],
        security: [{ bearerAuth: [] }],
        parameters: [pathIdParam('newsId', 'News identifier')],
        responses: {
          200: {
            description: 'Deleted news post',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/News' },
              },
            },
          },
        },
      },
    },
    '/tasks': {
      get: {
        summary: 'List tasks for the authenticated user',
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User tasks',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskListResponse' },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a task',
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        requestBody: buildRequestBody('TaskInput'),
        responses: {
          201: {
            description: 'Created task',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskResponse' },
              },
            },
          },
        },
      },
    },
    '/tasks/{taskId}': {
      get: {
        summary: 'Get a task by ID',
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        parameters: [pathIdParam('taskId', 'Task identifier')],
        responses: {
          200: {
            description: 'Task details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskResponse' },
              },
            },
          },
        },
      },
      patch: {
        summary: 'Update a task',
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        parameters: [pathIdParam('taskId', 'Task identifier')],
        requestBody: buildRequestBody('TaskUpdate'),
        responses: {
          200: {
            description: 'Updated task',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TaskResponse' },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete a task',
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        parameters: [pathIdParam('taskId', 'Task identifier')],
        responses: {
          204: { description: 'Deleted' },
        },
      },
    },
    '/notes': {
      get: {
        summary: 'List notes for the authenticated user',
        tags: ['Notes'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User notes',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NoteListResponse' },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a note',
        tags: ['Notes'],
        security: [{ bearerAuth: [] }],
        requestBody: buildRequestBody('NoteInput'),
        responses: {
          201: {
            description: 'Created note',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NoteResponse' },
              },
            },
          },
        },
      },
    },
    '/notes/{noteId}': {
      get: {
        summary: 'Get a note by ID',
        tags: ['Notes'],
        security: [{ bearerAuth: [] }],
        parameters: [pathIdParam('noteId', 'Note identifier')],
        responses: {
          200: {
            description: 'Note details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NoteResponse' },
              },
            },
          },
        },
      },
      patch: {
        summary: 'Update a note',
        tags: ['Notes'],
        security: [{ bearerAuth: [] }],
        parameters: [pathIdParam('noteId', 'Note identifier')],
        requestBody: buildRequestBody('NoteUpdate'),
        responses: {
          200: {
            description: 'Updated note',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/NoteResponse' },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete a note',
        tags: ['Notes'],
        security: [{ bearerAuth: [] }],
        parameters: [pathIdParam('noteId', 'Note identifier')],
        responses: {
          204: { description: 'Deleted' },
        },
      },
    },
    '/todos': {
      get: {
        summary: 'List todos',
        tags: ['Todos'],
        parameters: [...paginationParameters, ...todosFilterParameters],
        responses: {
          200: {
            description: 'Paginated todos',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedTodos' },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a todo',
        tags: ['Todos'],
        requestBody: buildRequestBody('TodoInput'),
        responses: {
          201: {
            description: 'Created todo',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TodoResponse' },
              },
            },
          },
        },
      },
    },
    '/todos/{todoId}': {
      get: {
        summary: 'Get a todo by ID',
        tags: ['Todos'],
        parameters: [pathIdParam('todoId', 'Todo identifier')],
        responses: {
          200: {
            description: 'Todo details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TodoResponse' },
              },
            },
          },
        },
      },
      patch: {
        summary: 'Update a todo',
        tags: ['Todos'],
        parameters: [pathIdParam('todoId', 'Todo identifier')],
        requestBody: buildRequestBody('TodoUpdate'),
        responses: {
          200: {
            description: 'Updated todo',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TodoResponse' },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete a todo',
        tags: ['Todos'],
        parameters: [pathIdParam('todoId', 'Todo identifier')],
        responses: {
          204: { description: 'Deleted' },
        },
      },
    },
    '/public/news': {
      get: {
        summary: 'List catalog news',
        tags: ['Catalog News'],
        parameters: [...paginationParameters, ...newsFilterParameters],
        responses: buildListResponses('PaginatedCatalogNews'),
      },
      post: {
        summary: 'Create catalog news',
        tags: ['Catalog News'],
        requestBody: buildRequestBody('CatalogNewsInput'),
        responses: buildCreateResponse('CatalogNews'),
      },
    },
    '/public/news/{newsId}': {
      get: {
        summary: 'Get a catalog news item',
        tags: ['Catalog News'],
        parameters: [pathIdParam('newsId', 'Catalog news identifier')],
        responses: buildItemResponse('CatalogNews'),
      },
      put: {
        summary: 'Update a catalog news item',
        tags: ['Catalog News'],
        parameters: [pathIdParam('newsId', 'Catalog news identifier')],
        requestBody: buildRequestBody('CatalogNewsUpdate'),
        responses: buildItemResponse('CatalogNews'),
      },
      delete: {
        summary: 'Delete a catalog news item',
        tags: ['Catalog News'],
        parameters: [pathIdParam('newsId', 'Catalog news identifier')],
        responses: { 204: { description: 'Deleted' } },
      },
    },
    '/public/songs': {
      get: {
        summary: 'List songs',
        tags: ['Songs'],
        parameters: [...paginationParameters, ...songFilterParameters],
        responses: buildListResponses('PaginatedSong'),
      },
      post: {
        summary: 'Create a song',
        tags: ['Songs'],
        requestBody: buildRequestBody('SongInput'),
        responses: buildCreateResponse('Song'),
      },
    },
    '/public/songs/{songId}': {
      get: {
        summary: 'Get a song',
        tags: ['Songs'],
        parameters: [pathIdParam('songId', 'Song identifier')],
        responses: buildItemResponse('Song'),
      },
      put: {
        summary: 'Update a song',
        tags: ['Songs'],
        parameters: [pathIdParam('songId', 'Song identifier')],
        requestBody: buildRequestBody('SongUpdate'),
        responses: buildItemResponse('Song'),
      },
      delete: {
        summary: 'Delete a song',
        tags: ['Songs'],
        parameters: [pathIdParam('songId', 'Song identifier')],
        responses: { 204: { description: 'Deleted' } },
      },
    },
    '/public/cars': {
      get: {
        summary: 'List cars',
        tags: ['Cars'],
        parameters: [...paginationParameters, ...carFilterParameters],
        responses: buildListResponses('PaginatedCar'),
      },
      post: {
        summary: 'Create a car',
        tags: ['Cars'],
        requestBody: buildRequestBody('CarInput'),
        responses: buildCreateResponse('Car'),
      },
    },
    '/public/cars/{carId}': {
      get: {
        summary: 'Get a car',
        tags: ['Cars'],
        parameters: [pathIdParam('carId', 'Car identifier')],
        responses: buildItemResponse('Car'),
      },
      put: {
        summary: 'Update a car',
        tags: ['Cars'],
        parameters: [pathIdParam('carId', 'Car identifier')],
        requestBody: buildRequestBody('CarUpdate'),
        responses: buildItemResponse('Car'),
      },
      delete: {
        summary: 'Delete a car',
        tags: ['Cars'],
        parameters: [pathIdParam('carId', 'Car identifier')],
        responses: { 204: { description: 'Deleted' } },
      },
    },
    '/public/movies': {
      get: {
        summary: 'List movies',
        tags: ['Movies'],
        parameters: [...paginationParameters, ...movieFilterParameters],
        responses: buildListResponses('PaginatedMovie'),
      },
      post: {
        summary: 'Create a movie',
        tags: ['Movies'],
        requestBody: buildRequestBody('MovieInput'),
        responses: buildCreateResponse('Movie'),
      },
    },
    '/public/movies/{movieId}': {
      get: {
        summary: 'Get a movie',
        tags: ['Movies'],
        parameters: [pathIdParam('movieId', 'Movie identifier')],
        responses: buildItemResponse('Movie'),
      },
      put: {
        summary: 'Update a movie',
        tags: ['Movies'],
        parameters: [pathIdParam('movieId', 'Movie identifier')],
        requestBody: buildRequestBody('MovieUpdate'),
        responses: buildItemResponse('Movie'),
      },
      delete: {
        summary: 'Delete a movie',
        tags: ['Movies'],
        parameters: [pathIdParam('movieId', 'Movie identifier')],
        responses: { 204: { description: 'Deleted' } },
      },
    },
    '/public/students': {
      get: {
        summary: 'List students',
        tags: ['Students'],
        parameters: [...paginationParameters, ...studentFilterParameters],
        responses: buildListResponses('PaginatedStudent'),
      },
      post: {
        summary: 'Create a student',
        tags: ['Students'],
        requestBody: buildRequestBody('StudentInput'),
        responses: buildCreateResponse('Student'),
      },
    },
    '/public/students/{studentId}': {
      get: {
        summary: 'Get a student',
        tags: ['Students'],
        parameters: [pathIdParam('studentId', 'Student identifier')],
        responses: buildItemResponse('Student'),
      },
      put: {
        summary: 'Update a student',
        tags: ['Students'],
        parameters: [pathIdParam('studentId', 'Student identifier')],
        requestBody: buildRequestBody('StudentUpdate'),
        responses: buildItemResponse('Student'),
      },
      delete: {
        summary: 'Delete a student',
        tags: ['Students'],
        parameters: [pathIdParam('studentId', 'Student identifier')],
        responses: { 204: { description: 'Deleted' } },
      },
    },
    '/public/lessons': {
      get: {
        summary: 'List lessons',
        tags: ['Lessons'],
        parameters: [...paginationParameters, ...lessonFilterParameters],
        responses: buildListResponses('PaginatedLesson'),
      },
      post: {
        summary: 'Create a lesson',
        tags: ['Lessons'],
        requestBody: buildRequestBody('LessonInput'),
        responses: buildCreateResponse('Lesson'),
      },
    },
    '/public/lessons/{lessonId}': {
      get: {
        summary: 'Get a lesson',
        tags: ['Lessons'],
        parameters: [pathIdParam('lessonId', 'Lesson identifier')],
        responses: buildItemResponse('Lesson'),
      },
      put: {
        summary: 'Update a lesson',
        tags: ['Lessons'],
        parameters: [pathIdParam('lessonId', 'Lesson identifier')],
        requestBody: buildRequestBody('LessonUpdate'),
        responses: buildItemResponse('Lesson'),
      },
      delete: {
        summary: 'Delete a lesson',
        tags: ['Lessons'],
        parameters: [pathIdParam('lessonId', 'Lesson identifier')],
        responses: { 204: { description: 'Deleted' } },
      },
    },
  },
  components: {
    schemas: {
      CatalogNews: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          summary: { type: 'string' },
          source: { type: 'string' },
          category: {
            type: 'string',
            enum: [
              'technology',
              'business',
              'health',
              'lifestyle',
              'science',
              'entertainment',
            ],
          },
          publishedAt: { type: 'string', format: 'date-time' },
          url: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CatalogNewsInput: {
        type: 'object',
        required: ['title', 'summary', 'source', 'category', 'publishedAt'],
        properties: {
          title: { type: 'string' },
          summary: { type: 'string' },
          source: { type: 'string' },
          category: {
            type: 'string',
            enum: [
              'technology',
              'business',
              'health',
              'lifestyle',
              'science',
              'entertainment',
            ],
          },
          publishedAt: { type: 'string', format: 'date-time' },
          url: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },
      CatalogNewsUpdate: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          summary: { type: 'string' },
          source: { type: 'string' },
          category: {
            type: 'string',
            enum: [
              'technology',
              'business',
              'health',
              'lifestyle',
              'science',
              'entertainment',
            ],
          },
          publishedAt: { type: 'string', format: 'date-time' },
          url: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },
      Song: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          artist: { type: 'string' },
          album: { type: 'string' },
          genre: { type: 'string' },
          releaseYear: { type: 'integer' },
          durationSeconds: { type: 'integer' },
          label: { type: 'string' },
          language: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      SongInput: {
        type: 'object',
        required: [
          'title',
          'artist',
          'genre',
          'releaseYear',
          'durationSeconds',
        ],
        properties: {
          title: { type: 'string' },
          artist: { type: 'string' },
          album: { type: 'string' },
          genre: { type: 'string' },
          releaseYear: { type: 'integer' },
          durationSeconds: { type: 'integer' },
          label: { type: 'string' },
          language: { type: 'string' },
        },
      },
      SongUpdate: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          artist: { type: 'string' },
          album: { type: 'string' },
          genre: { type: 'string' },
          releaseYear: { type: 'integer' },
          durationSeconds: { type: 'integer' },
          label: { type: 'string' },
          language: { type: 'string' },
        },
      },
      Car: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          make: { type: 'string' },
          model: { type: 'string' },
          year: { type: 'integer' },
          color: { type: 'string' },
          price: { type: 'number' },
          mileage: { type: 'number' },
          fuelType: {
            type: 'string',
            enum: ['gasoline', 'diesel', 'electric', 'hybrid'],
          },
          description: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CarInput: {
        type: 'object',
        required: ['make', 'model', 'year', 'color', 'price', 'fuelType'],
        properties: {
          make: { type: 'string' },
          model: { type: 'string' },
          year: { type: 'integer' },
          color: { type: 'string' },
          price: { type: 'number' },
          mileage: { type: 'number' },
          fuelType: {
            type: 'string',
            enum: ['gasoline', 'diesel', 'electric', 'hybrid'],
          },
          description: { type: 'string' },
        },
      },
      CarUpdate: {
        type: 'object',
        properties: {
          make: { type: 'string' },
          model: { type: 'string' },
          year: { type: 'integer' },
          color: { type: 'string' },
          price: { type: 'number' },
          mileage: { type: 'number' },
          fuelType: {
            type: 'string',
            enum: ['gasoline', 'diesel', 'electric', 'hybrid'],
          },
          description: { type: 'string' },
        },
      },
      Movie: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          director: { type: 'string' },
          genre: { type: 'string' },
          releaseYear: { type: 'integer' },
          rating: { type: 'number' },
          durationMinutes: { type: 'integer' },
          language: { type: 'string' },
          summary: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      MovieInput: {
        type: 'object',
        required: [
          'title',
          'director',
          'genre',
          'releaseYear',
          'durationMinutes',
        ],
        properties: {
          title: { type: 'string' },
          director: { type: 'string' },
          genre: { type: 'string' },
          releaseYear: { type: 'integer' },
          rating: { type: 'number' },
          durationMinutes: { type: 'integer' },
          language: { type: 'string' },
          summary: { type: 'string' },
        },
      },
      MovieUpdate: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          director: { type: 'string' },
          genre: { type: 'string' },
          releaseYear: { type: 'integer' },
          rating: { type: 'number' },
          durationMinutes: { type: 'integer' },
          language: { type: 'string' },
          summary: { type: 'string' },
        },
      },
      Student: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          major: { type: 'string' },
          cohortYear: { type: 'integer' },
          gpa: { type: 'number' },
          enrolled: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      StudentInput: {
        type: 'object',
        required: ['firstName', 'lastName', 'major', 'cohortYear'],
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          major: { type: 'string' },
          cohortYear: { type: 'integer' },
          gpa: { type: 'number' },
          enrolled: { type: 'boolean' },
        },
      },
      StudentUpdate: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          major: { type: 'string' },
          cohortYear: { type: 'integer' },
          gpa: { type: 'number' },
          enrolled: { type: 'boolean' },
        },
      },
      Lesson: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          subject: { type: 'string' },
          level: {
            type: 'string',
            enum: ['beginner', 'intermediate', 'advanced'],
          },
          teacher: { type: 'string' },
          durationMinutes: { type: 'integer' },
          publishedAt: { type: 'string', format: 'date-time' },
          summary: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      LessonInput: {
        type: 'object',
        required: [
          'title',
          'subject',
          'teacher',
          'durationMinutes',
          'publishedAt',
        ],
        properties: {
          title: { type: 'string' },
          subject: { type: 'string' },
          level: {
            type: 'string',
            enum: ['beginner', 'intermediate', 'advanced'],
          },
          teacher: { type: 'string' },
          durationMinutes: { type: 'integer' },
          publishedAt: { type: 'string', format: 'date-time' },
          summary: { type: 'string' },
        },
      },
      LessonUpdate: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          subject: { type: 'string' },
          level: {
            type: 'string',
            enum: ['beginner', 'intermediate', 'advanced'],
          },
          teacher: { type: 'string' },
          durationMinutes: { type: 'integer' },
          publishedAt: { type: 'string', format: 'date-time' },
          summary: { type: 'string' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          typeAccount: {
            type: 'string',
            enum: ['freeUser', 'paidUser', 'agencyUser'],
          },
        },
        required: ['id', 'name', 'email', 'typeAccount'],
      },
      UserResponse: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/User' },
        },
        required: ['user'],
      },
      AuthRegisterInput: {
        type: 'object',
        required: ['email', 'name', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          password: { type: 'string' },
          typeAccount: {
            type: 'string',
            enum: ['freeUser', 'paidUser', 'agencyUser'],
          },
        },
      },
      AuthLoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      AuthTokensWithUser: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          user: { $ref: '#/components/schemas/User' },
        },
        required: ['accessToken', 'user'],
      },
      News: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          userId: { type: 'string' },
          topic: { type: 'string' },
          text: { type: 'string' },
          type: {
            type: 'string',
            enum: ['updates', 'news', 'testimonials', 'video stories'],
          },
          typeAccount: {
            type: 'string',
            enum: ['freeUser', 'paidUser', 'agencyUser'],
          },
          files: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      NewsInput: {
        type: 'object',
        required: ['topic', 'text', 'type'],
        properties: {
          topic: { type: 'string' },
          text: { type: 'string' },
          type: {
            type: 'string',
            enum: ['updates', 'news', 'testimonials', 'video stories'],
          },
          files: { type: 'array', items: { type: 'string' } },
        },
      },
      PaginatedNews: paginatedSchema('News', 'news'),
      Task: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          userId: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['todo', 'in-progress', 'done'] },
          dueDate: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      TaskInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['todo', 'in-progress', 'done'] },
          dueDate: { type: 'string', format: 'date-time' },
        },
      },
      TaskUpdate: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['todo', 'in-progress', 'done'] },
          dueDate: { type: 'string', format: 'date-time' },
        },
      },
      TaskListResponse: {
        type: 'object',
        properties: {
          tasks: {
            type: 'array',
            items: { $ref: '#/components/schemas/Task' },
          },
        },
      },
      TaskResponse: {
        type: 'object',
        properties: {
          task: { $ref: '#/components/schemas/Task' },
        },
      },
      Note: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          userId: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          archived: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      NoteInput: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          archived: { type: 'boolean' },
        },
      },
      NoteUpdate: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          archived: { type: 'boolean' },
        },
      },
      NoteListResponse: {
        type: 'object',
        properties: {
          notes: {
            type: 'array',
            items: { $ref: '#/components/schemas/Note' },
          },
        },
      },
      NoteResponse: {
        type: 'object',
        properties: {
          note: { $ref: '#/components/schemas/Note' },
        },
      },
      Todo: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          completed: { type: 'boolean' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          dueDate: { type: 'string', format: 'date-time' },
          category: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      TodoInput: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          completed: { type: 'boolean' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          dueDate: { type: 'string', format: 'date-time' },
          category: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },
      TodoUpdate: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          completed: { type: 'boolean' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          dueDate: { type: 'string', format: 'date-time' },
          category: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },
      TodoResponse: {
        type: 'object',
        properties: {
          todo: { $ref: '#/components/schemas/Todo' },
        },
      },
      PaginatedCatalogNews: paginatedSchema('CatalogNews'),
      PaginatedSong: paginatedSchema('Song'),
      PaginatedCar: paginatedSchema('Car'),
      PaginatedMovie: paginatedSchema('Movie'),
      PaginatedStudent: paginatedSchema('Student'),
      PaginatedLesson: paginatedSchema('Lesson'),
      PaginatedTodos: paginatedSchema('Todo', 'todos'),
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

export default swaggerSpec;
