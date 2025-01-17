<template>
  <div>
    <form @submit.prevent="addTodo" class="flex flex-col mb-4">
      <input
        v-model="newTodo"
        type="text"
        placeholder="Ajouter une tâche"
        class="flex-grow px-4 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        v-model="newPriority"
        class="flex-grow px-4 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="haute">Haute</option>
        <option value="moyenne">Moyenne</option>
        <option value="basse">Basse</option>
      </select>
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
      >
        Ajouter
      </button>
    </form>

    <!-- Search Section -->
    <div class="mb-4">
      <h3 class="font-bold mb-2">Search by Title</h3>
      <div class="flex items-center">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher une tâche"
          class="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
          @input="resetFilters('search')"
          />
        <button @click="searchTodos" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none">
          Search
        </button>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="mb-4">
      <h3 class="font-bold mb-2">Filter by Tags</h3>
      <div class="flex items-center flex-wrap">
        <label v-for="tag in tags" :key="tag._id" class="flex items-center mr-4 mb-2">
          <input
            type="checkbox"
            :value="tag._id"
            v-model="selectedTags"
            class="form-checkbox h-5 w-5 mr-2"
          />
          <span
            :style="{ backgroundColor: tag.color }"
            class="inline-block w-4 h-4 rounded mr-2"
          ></span>
          {{ tag.name }}
        </label>
      </div>
      <button @click="filterTodos" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none">
        Search
      </button>
      <h3 class="font-bold mb-2">Filter by Completion</h3>
      <div class="flex items-center">
        <button
          @click="filterCompleted(true)"
          class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none mr-2"
        >
          Completed
        </button>
        <button
          @click="filterCompleted(false)"
          class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
        >
          Incomplete
        </button>
      </div>
    </div>

    <div ref="sortableList" class="space-y-2">
      <transition-group>
        <li v-for="todo in filteredTodos" :key="todo._id" class="flex flex-col p-2 bg-gray-50 rounded-md shadow-sm">
          <div @click="toggleTagList(todo)" class="cursor-pointer flex items-center justify-between">
            <span>
              <input
                type="checkbox"
                v-model="todo.completed"
                @change="updateTodoCompletion(todo)"
                class="form-checkbox h-5 w-5 text-blue-600 mr-2"
              />
              <span
                :class="{ 'line-through text-gray-500': todo.completed, 'text-gray-900': !todo.completed }"
              >
                {{ todo.title }}
              </span>
            </span>
            <div :class="getPriorityClass(todo.priority)" class="px-2 py-1 rounded-full text-white">
              {{ todo.priority }}
            </div>

            <button @click.stop="deleteTodo(todo._id)" class="text-red-500 hover:text-red-700 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="activeTodo === todo._id" class="mt-2 border-t pt-2" @mouseleave="updateTodoTags(todo)">
            <div class="flex items-center mb-2">
              <input
                v-model="newTag.name"
                type="text"
                placeholder="Nom du tag"
                class="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
              />
              <input
                v-model="newTag.color"
                type="color"
                class="w-10 h-10 border rounded-md mr-2"
              />
              <button @click.stop="addTag" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none">
                +
              </button>
            </div>

            <div class="flex flex-wrap">
              <span
                v-for="tag in tags"
                :key="tag._id"
                @click.stop="toggleTagForTodo(todo, tag)"
                :style="{ backgroundColor: tag.color }"
                :class="{
                  'px-2 py-1 rounded-md cursor-pointer': true,
                  'opacity-50': !todo.tags.some(t => t._id === tag._id),
                  'opacity-100': todo.tags.some(t => t._id === tag._id)
                }"
                class="mr-2 mb-2"
              >
                {{ tag.name }}
              </span>
            </div>
          </div>

          <div v-if="todo.tags.length > 0" class="flex flex-wrap mt-2">
            <span
              v-for="tag in todo.tags"
              :key="tag._id"
              :style="{ backgroundColor: tag.color }"
              class="px-2 py-1 rounded-md text-white mr-2 mb-2"
            >
              {{ tag.name }}
            </span>
          </div>
        </li>
      </transition-group>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Sortable from 'sortablejs';

export default {
  name: 'TodoList',
  data() {
    return {
      todos: [],
      newTodo: '',
      newPriority: 'moyenne', // Priority of the new todo
      tags: [],
      selectedTags: [],
      searchQuery: '', // For search by title
      newTag: {
        name: '',
        color: '#000000',
      },
      activeTodo: null, // ID of the currently active todo
      filteredTodos: [],
    };
  },
  methods: {
    async fetchTodos() {
      try {
        const response = await axios.get('/api/todos');
        this.todos = response.data;
        this.filteredTodos = response.data; // Initialize filteredTodos
      } catch (error) {
        console.error('Erreur lors de la récupération des tâches:', error);
      }
    },
    async fetchTags() {
      try {
        const response = await axios.get('/api/tags');
        this.tags = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des tags:', error);
      }
    },
    async addTodo() {
      if (!this.newTodo.trim()) return;
      this.resetFilters('add');
      try {
        const response = await axios.post('/api/todos', {
          title: this.newTodo,
          priority: this.newPriority,
        });
        this.todos.push(response.data);
        this.filteredTodos = [...this.todos];
        this.newTodo = '';
        this.newPriority = 'moyenne';
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la tâche:', error);
      }
    },
    async searchTodos() {
      this.resetFilters('search');
      try {
        const response = await axios.get(`/api/todos/search?title=${this.searchQuery}`);
        this.filteredTodos = response.data.todos;
      } catch (error) {
        console.error('Erreur lors de la recherche des tâches:', error);
      }
    },
    async filterCompleted(status) {
      this.resetFilters('filter');
      try {
        const response = await axios.get(`/api/todos/filter?completed=${status}`);
        this.filteredTodos = response.data;
      } catch (error) {
        console.error('Erreur lors du filtrage des tâches:', error);
      }
    },
    async addTag() {
      if (!this.newTag.name.trim()) return;
      try {
        const response = await axios.post('/api/tags', this.newTag);
        this.tags.push(response.data);
        this.newTag.name = '';
        this.newTag.color = '#000000';
      } catch (error) {
        console.error('Erreur lors de l\'ajout du tag:', error);
      }
    },
    toggleTagForTodo(todo, tag) {
      const tagIndex = todo.tags.findIndex(t => t._id === tag._id);
      if (tagIndex === -1) {
        this.addTagToTodo(todo, tag);
      } else {
        this.removeTagFromTodo(todo, tag);
      }
    },
    async addTagToTodo(todo, tag) {
      try {
        await axios.post(`/api/todos/${todo._id}/tags`, { tags: [tag._id] });
        todo.tags.push(tag);
      } catch (error) {
        console.error('Erreur lors de l\'ajout du tag à la tâche:', error);
      }
    },
    async removeTagFromTodo(todo, tag) {
      try {
        await axios.delete(`/api/todos/${todo._id}/tags`, { data: { tags: [tag._id] } });
        todo.tags = todo.tags.filter(t => t._id !== tag._id);
      } catch (error) {
        console.error('Erreur lors de la suppression du tag de la tâche:', error);
      }
    },
    async updateTodoTags(todo) {
      try {
        await axios.post(`/api/todos/${todo._id}/tags`, { tags: todo.tags.map(t => t._id) });
      } catch (error) {
        console.error('Erreur lors de la mise à jour des tags:', error);
      }
    },
    filterTodos() {
      if (this.selectedTags.length === 0) {
        this.filteredTodos = [...this.todos];
      } else {
        this.filteredTodos = this.todos.filter(todo =>
          todo.tags.some(tag => this.selectedTags.includes(tag._id))
        );
      }
    },
    resetFilters(exclude) {
      if (exclude !== 'add') this.newTodo = '';
      if (exclude !== 'search') this.searchQuery = '';
      if (exclude !== 'filter') this.filteredTodos = [...this.todos];
    },
    async updateTodoCompletion(todo) {
      try {
        await axios.patch(`/api/todos/${todo._id}`, { completed: todo.completed });
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la tâche:', error);
      }
    },
    async deleteTodo(id) {
      try {
        await axios.delete(`/api/todos/${id}`);
        this.todos = this.todos.filter(todo => todo._id !== id);
        this.filteredTodos = this.filteredTodos.filter(todo => todo._id !== id);
      } catch (error) {
        console.error('Erreur lors de la suppression de la tâche:', error);
      }
    },
    toggleTagList(todo) {
      this.activeTodo = this.activeTodo === todo._id ? null : todo._id;
    },
    getPriorityClass(priority) {
      switch (priority) {
        case 'haute':
          return 'bg-red-500';
        case 'moyenne':
          return 'bg-yellow-500';
        case 'basse':
          return 'bg-green-500';
        default:
          return 'bg-gray-500';
      }
    },
  },
  mounted() {
    this.fetchTodos();
    this.fetchTags();

    Sortable.create(this.$refs.sortableList, {
      handle: '.handle',
      animation: 150,
    });
  },
};
</script>

<style scoped>
.handle {
  display: flex;
  align-items: center;
}
</style>