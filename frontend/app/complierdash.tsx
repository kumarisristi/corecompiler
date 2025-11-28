
"use client";

import { useState, useMemo } from "react";

import { languages, categories } from "@/data/languages";
import { LanguageCard } from "@/components/LanguageCard";
import { Search, Code2 } from "lucide-react";

export default function CompilerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredLanguages = useMemo(() => {
    return languages.filter((language) => {
      const matchesSearch =
        language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        language.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || language.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-200 pt-4">
      {/* Header */}
      <header className="border-b border-border bg-gray-200 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Code2 className="w-9 h-9 text-primary drop-shadow" />
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                Online Compiler
              </h1>
            </div>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Pick a language and jump straight into writing code — fast and clean.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-10 w-full rounded-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 py-5 shadow-sm"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-5 py-2 text-sm transition-all hover:scale-105 ${
                  selectedCategory === category 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Languages Grid */}
      <main className="container mx-auto px-4 py-6 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {filteredLanguages.map((language) => (
            <LanguageCard key={language.id} language={language} />
          ))}
        </div>

        {filteredLanguages.length === 0 && (
          <div className="text-center py-16 opacity-70">
            <Code2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No languages found
            </h3>
            <p className="text-muted-foreground">Try refining your search.</p>
          </div>
        )}
      </main>
    </div>
  );
}
