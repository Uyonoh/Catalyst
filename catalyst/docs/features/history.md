# History Management

The **History Management** system provides comprehensive prompt history tracking, allowing users to revisit, organize, and manage all their previous prompt optimizations. It offers advanced filtering, search, and analytics capabilities.

## Overview

The History feature enables users to:
- View all previously created and optimized prompts
- Search and filter by various criteria
- Organize prompts with tags, categories, and favorites
- Track usage statistics and patterns
- Quickly access frequently used prompts

## Core Components

### History Page

The main history interface located at `/history`:

```
app/history/
├── page.tsx              # Main history page
├── loading.tsx           # Loading states
└── [id]/
    └── page.tsx          # Individual prompt detail view
```

### History Components

```
app/components/history/
├── HistoryList.tsx       # Main list display with pagination
├── HistoryCard.tsx       # Individual prompt card
├── HistoryFilters.tsx     # Filter controls
├── HistorySearch.tsx     # Search functionality
├── HistoryPagination.tsx # Pagination controls
└── Notification.tsx      # User notifications
```

## Data Model

### Prompt Entity

Each saved prompt in the system:

```typescript
// Database schema for prompts table
interface Prompt {
  id: string;                    // Unique identifier
  user_id: string;              // Owner user ID
  workspace_id: string | null;  // Associated workspace
  title: string;                // User-friendly title
  content: string;              // Optimized prompt content
  snippet: string;              // Short preview (first 150 chars)
  raw_input: string;            // Original user input
  target_model: TargetModel;    // Model used for optimization
  is_public: boolean;           // Visibility setting
  icon: string;                 // Category icon
  tag: string;                  // User-defined tag
  format: string;               // Output format (text, json, etc.)
  is_favorite: boolean;         // User favorite flag
  created_at: Date;             // Creation timestamp
  updated_at: Date;             // Last update timestamp
}
```

## API Endpoints

### GET /history

Fetches user's prompt history with filtering and pagination:

**Request Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `q` | string | Search query | `q=react` |
| `tags` | string | Comma-separated tags | `tags=frontend,typescript` |
| `icons` | string | Comma-separated categories | `icons=chat,code` |
| `models` | string | Comma-separated models | `models=claude,gpt` |
| `modes` | string | Comma-separated modalities | `modes=text,image` |
| `sort` | string | Sort order | `sort=newest` |
| `favorites` | string | Filter favorites | `favorites=true` |
| `page` | number | Page number | `page=1` |

**Response Format:**

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Create React Component",
      "content": "Optimized prompt text...",
      "snippet": "Optimized prompt text...",
      "raw_input": "Create a React component",
      "target_model": "CLAUDE_3_5_SONNET",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "is_public": false,
      "icon": "code",
      "tag": "frontend",
      "format": "text",
      "is_favorite": false
    }
  ],
  "totalCount": 42,
  "topModel": "CLAUDE_3_5_SONNET"
}
```

## Filtering System

### Search Functionality

The system supports comprehensive search across multiple fields:

```typescript
// Search implementation from history/page.tsx
function getHistoryItems(userId: string, searchParams: HistoryFilters) {
  let query = supabase
    .from("prompts")
    .select("id, title, content, snippet, raw_input, target_model, created_at, updated_at, is_public, icon, tag, is_favorite")
    .eq("user_id", userId);

  // Full-text search
  if (searchParams.q) {
    query = query.or(
      `title.ilike.%${searchParams.q}%,content.ilike.%${searchParams.q}%,raw_input.ilike.%${searchParams.q}%`
    );
  }
  
  // Tag filtering
  if (searchParams.tags) {
    const tagsArray = searchParams.tags.split(",").map(t => t.trim()).filter(Boolean);
    query = query.in("tag", tagsArray);
  }
  
  // Category filtering
  if (searchParams.icons) {
    const iconsArray = searchParams.icons.split(",").map(i => i.trim()).filter(Boolean);
    query = query.in("icon", iconsArray);
  }
  
  // Model filtering
  if (searchParams.models) {
    const modelsArray = searchParams.models.split(",").map(m => m.trim()).filter(Boolean);
    query = query.in("target_model", modelsArray);
  }
  
  // Modality filtering
  if (searchParams.modes) {
    const modesArray = searchParams.modes.split(",").map(m => m.trim().toLowerCase());
    // Filter by model type (image, video, text)
    query = query // ... modality filter logic
  }
  
  return query;
}
```

### Filter Options

| Filter Type | Available Options | Description |
|-------------|-------------------|-------------|
| **Sort** | `newest`, `oldest`, `title` | Sort order for results |
| **Tags** | Any user-defined tag | Filter by user tags |
| **Icons** | `chat`, `code`, `image`, `video`, `music`, `brain`, `document` | Filter by category |
| **Models** | Any `TargetModel` value | Filter by AI model |
| **Modes** | `text`, `image`, `video`, `audio`, `code`, `geospatial` | Filter by modality |
| **Favorites** | `true`, `false` | Filter by favorite status |

## Pagination

The system implements efficient pagination:

```typescript
// Pagination implementation
const PAGE_SIZE = 9; // Items per page
const page = searchParams.page || 1;
const start = (page - 1) * PAGE_SIZE;
const slicedData = filteredData.slice(start, start + PAGE_SIZE);

return {
  items: slicedData,
  totalCount: filteredData.length,
  currentPage: page,
  pageSize: PAGE_SIZE,
  totalPages: Math.ceil(filteredData.length / PAGE_SIZE)
};
```

## Statistics and Analytics

### Quick Stats

The history page displays real-time statistics:

```tsx
// Stats cards from history/page.tsx
<div className="grid grid-cols-2 gap-3">
  <GlassPanel className="p-4 flex flex-col gap-1">
    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
      Total Prompts
    </span>
    <div className="flex items-center gap-2">
      <History className="size-4 text-cyan-400" />
      <span className="text-2xl font-black text-white">{totalCount}</span>
    </div>
  </GlassPanel>
  
  <GlassPanel className="p-4 flex flex-col gap-1">
    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
      Top Model
    </span>
    <div className="flex items-center gap-2">
      <BrainCircuit className="size-4 text-emerald-400" />
      <span className="text-sm font-black text-white truncate max-w-[80px]">
        {topModel}
      </span>
    </div>
  </GlassPanel>
</div>
```

### Model Usage Tracking

The system automatically tracks which models are used most frequently:

```typescript
// Model usage analysis
const modelCounts: { [key: string]: number } = {};
filteredData.forEach((item) => {
  if (item.target_model) {
    modelCounts[item.target_model] = (modelCounts[item.target_model] || 0) + 1;
  }
});

// Find most used model
let maxCount = 0;
let topModel = "None";
for (const [model, count] of Object.entries(modelCounts)) {
  if (count > maxCount) {
    maxCount = count;
    topModel = model;
  }
}
```

## User Interface

### History List

The main history display with responsive grid layout:

```tsx
// HistoryList component
interface HistoryListProps {
  initialItems: Prompt[];
  currentPage: number;
  totalCount: number;
  pageSize: number;
}

function HistoryList({ initialItems, currentPage, totalCount, pageSize }: HistoryListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {initialItems.map((item) => (
        <HistoryCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

### History Card

Individual prompt card with comprehensive information:

```tsx
// HistoryCard component
interface HistoryCardProps {
  item: Prompt;
}

function HistoryCard({ item }: HistoryCardProps) {
  return (
    <GlassPanel className="p-4 hover:bg-white/5 transition-all cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white truncate">{item.title}</h3>
          <p className="text-sm text-slate-400 mt-1">{item.snippet}</p>
          <div className="flex items-center gap-2 mt-3 text-xs">
            <span className="text-slate-500">{formatDate(item.created_at)}</span>
            <span className="text-cyan-400">{item.target_model}</span>
            <span className="text-emerald-400">{item.tag}</span>
          </div>
        </div>
        <button className="text-slate-500 hover:text-white">
          <Heart className={item.is_favorite ? "fill-red-500" : "fill-none"} />
        </button>
      </div>
    </GlassPanel>
  );
}
```

## Features

### Search and Filter

- **Multi-criteria filtering** - Combine multiple filters simultaneously
- **Debounced search** - 300ms delay for search input
- **URL-based state** - Filters persist in URL for shareable links
- **Real-time updates** - Results update as filters change

### Favorites

- **Star favorite prompts** - Quick access to frequently used prompts
- **Favorites-only view** - Filter to show only favorited items
- **Persistent favorites** - Saved across sessions
- **Visual indicators** - Heart icon with fill state

### Categories and Tags

- **Icon-based categories** - Visual organization by use case
- **Custom tags** - User-defined organization system
- **Multiple tags** - Support for multiple tags per prompt
- **Tag suggestions** - Auto-suggest based on similar prompts

### Pagination

- **Page size** - 9 items per page (configurable)
- **Page navigation** - Previous/next buttons
- **Page selector** - Direct page access
- **Total count** - Shows total items and current range

## Performance Optimizations

### Client-Side Filtering

For better performance, filtering is done client-side after initial data fetch:

```typescript
// Client-side filtering from history/page.tsx
let filteredData = data || [];

// Apply modality filtering on client
if (searchParams.modes) {
  const modesArray = searchParams.modes
    .split(",")
    .map((m) => m.trim().toLowerCase());
  
  filteredData = filteredData.filter((item: any) => {
    const model = (item.target_model || "").toLowerCase();
    // Check model against modality
    return this.matchModality(model, modesArray);
  });
}
```

### Efficient Data Fetching

- **Single database query** - All filtering applied at query level
- **Minimal data transfer** - Only necessary fields selected
- **Caching** - Results cached for repeat requests
- **Lazy loading** - Additional data loaded as needed

## Error Handling

### Common Scenarios

| Scenario | User Experience | Resolution |
|----------|-----------------|------------|
| No results | Empty state with helpful message | Show create new prompt CTA |
| Database error | Error message with retry button | Auto-retry after delay |
| Authentication error | Redirect to login | Preserve filters in redirect URL |
| Invalid filters | Reset to defaults | Show validation message |

### Error States

```tsx
// Error handling in HistoryList
if (error) {
  return (
    <div className="text-center py-12">
      <AlertCircle className="size-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">
        Failed to load history
      </h3>
      <p className="text-slate-400 mb-4">{error.message}</p>
      <button 
        onClick={() => refetch()} 
        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded"
      >
        Try Again
      </button>
    </div>
  );
}

if (items.length === 0) {
  return (
    <div className="text-center py-12">
      <History className="size-12 text-slate-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">
        No prompts found
      </h3>
      <p className="text-slate-400 mb-4">
        Try adjusting your filters or create your first prompt
      </p>
      <Link href="/studio" className="text-cyan-400 hover:text-cyan-300">
        Create New Prompt
      </Link>
    </div>
  );
}
```

## Accessibility

### Keyboard Navigation

- **Tab** - Navigate between interactive elements
- **Enter** - Select/activate items
- **Escape** - Close modals/dialogs
- **Arrow keys** - Navigate within dropdowns

### Screen Reader Support

- **Semantic HTML** - Proper heading hierarchy and ARIA labels
- **Live regions** - Announce dynamic content changes
- **Focus management** - Logical focus order
- **Descriptive labels** - Clear, meaningful text for all interactive elements

### Visual Accessibility

- **High contrast** - Glass panel design with clear text
- **Color blind friendly** - Multiple visual cues beyond color
- **Responsive text** - Text scales with viewport size
- **Touch targets** - Minimum 44x44px for touch interactions

## Usage Examples

### Basic History Access

```tsx
import { getServerUser, createClient } from "@/app/lib/supabase-server";
import HistoryList from "@/app/components/history/HistoryList";

export default async function HistoryPage({ searchParams }) {
  const user = await getServerUser();
  
  if (!user) {
    redirect("/login?redirect=/history");
  }
  
  const { items, totalCount, topModel } = await getHistoryItems(user.id, searchParams);
  
  return (
    <>
      <Header />
      <main>
        <HistoryList 
          initialItems={items} 
          currentPage={currentPage} 
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
        />
      </main>
      <Footer />
    </>
  );
}
```

### Filter Usage

```typescript
// Using filters in URL
// /history?q=react&tags=frontend&models=claude&sort=newest&page=1

// Programmatic filtering
const filters = {
  q: "react",
  tags: "frontend,typescript",
  models: "CLAUDE_3_5_SONNET,GPT_4O",
  modes: "text",
  sort: "newest",
  favorites: "true",
  page: 1
};

const { items, totalCount } = await getHistoryItems(userId, filters);
```

### Analytics Integration

```typescript
// Track history usage analytics
function trackHistoryAccess(userId: string, filters: HistoryFilters) {
  analytics.track('History Accessed', {
    userId,
    filterCount: Object.keys(filters).length,
    hasSearch: !!filters.q,
    hasTags: !!filters.tags,
    hasModels: !!filters.models,
    page: filters.page || 1
  });
}
```

## See Also

- [Prompt Studio](../studio.md) - Create new prompts
- [Analysis Engine](../analysis.md) - How prompts are optimized
- [API Reference](../api/index.md) - Technical API documentation
- [Database Schema](../architecture/data-flow.md) - Data storage details
- [Components - HistoryCard](../components/index.md) - UI component details