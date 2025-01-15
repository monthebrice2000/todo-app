<template>
  <div>
    <form @submit.prevent="addTodo" class="flex mb-4">
      <input
        v-model="newTodo"
        type="text"
        placeholder="Ajouter une tâche"
        class="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Ajouter
      </button>
    </form>

    <div ref="sortableList" class="space-y-2">
      <transition-group>
        <li
          v-for="todo in todos"
          :key="todo._id"
          class="flex items-center justify-between p-2 bg-gray-50 rounded-md shadow-sm"
        >
          <div class="flex items-center">
            <span class="handle cursor-move mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 8h16M4 16h16" />
              </svg>
            </span>
            <input
              type="checkbox"
              v-model="todo.completed"
              @change="updateTodo(todo)"
              class="form-checkbox h-5 w-5 text-blue-600"
            />
            <span
              :class="{
                'line-through text-gray-500': todo.completed,
                'text-gray-900': !todo.completed
              }"
              class="ml-2"
            >
              {{ todo.title }}
            </span>
          </div>
          <button
            @click="deleteTodo(todo._id)"
            class="text-red-500 hover:text-red-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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
      notification: '',
      notificationClass: ''
    };
  },
  methods: {
    async fetchTodos() {
      try {
        const response = await axios.get('/api/todos');
        this.todos = response.data;
      } catch (error) {
        console.error(error);
        this.showNotification('Erreur lors de la récupération des tâches.', 'bg-red-100 text-red-700');
      }
    },
    async addTodo() {
      if (this.newTodo.trim() === '') return;
      try {
        const response = await axios.post('/api/todos', { title: this.newTodo });
        this.todos.push(response.data);
        this.newTodo = '';
        this.showNotification('Tâche ajoutée avec succès.', 'bg-green-100 text-green-700');
      } catch (error) {
        console.error(error);
        this.showNotification('Erreur lors de l\'ajout de la tâche.', 'bg-red-100 text-red-700');
      }
    },
    async updateTodo(todo) {
      try {
        await axios.patch(`/api/todos/${todo._id}`, { completed: todo.completed });
        this.showNotification('Tâche mise à jour.', 'bg-green-100 text-green-700');
      } catch (error) {
        console.error(error);
        this.showNotification('Erreur lors de la mise à jour de la tâche.', 'bg-red-100 text-red-700');
      }
    },
    async deleteTodo(id) {
      try {
        await axios.delete(`/api/todos/${id}`);
        this.todos = this.todos.filter(todo => todo._id !== id);
        this.showNotification('Tâche supprimée.', 'bg-green-100 text-green-700');
      } catch (error) {
        console.error(error);
        this.showNotification('Erreur lors de la suppression de la tâche.', 'bg-red-100 text-red-700');
      }
    },
    async onDragEnd() {
      try {
        await axios.put('/api/todos/reorder', { todos: this.todos });
        this.showNotification('Ordre des tâches mis à jour.', 'bg-green-100 text-green-700');
      } catch (error) {
        console.error('Error updating order:', error);
        this.showNotification('Erreur lors de la mise à jour de l\'ordre.', 'bg-red-100 text-red-700');
      }
    },
    showNotification(message, className) {
      this.notification = message;
      this.notificationClass = className;
      setTimeout(() => {
        this.notification = '';
      }, 3000);
    }
  },
  mounted() {
    this.fetchTodos();

    // Initialiser Sortable
    Sortable.create(this.$refs.sortableList, {
      handle: '.handle',
      animation: 150,
      onEnd: this.onDragEnd,
    });
  }
};
</script>

<style scoped>
.handle {
  display: flex;
  align-items: center;
}
</style>
