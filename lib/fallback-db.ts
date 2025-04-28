// This is a temporary fallback solution if your database connection isn't working

export type User = {
    id: string
    name: string
    email: string
    password: string
    bio: string
    image: string
  }
  
  export type Book = {
    id: string
    title: string
    description: string
    image: string
    createdAt: string
  }
  
  export type Blog = {
    id: string
    title: string
    summary: string
    content: string
    image: string
    createdAt: string
  }
  
  export type Message = {
    id: string
    name: string
    email: string
    message: string
    createdAt: string
  }
  
  // Mock data
  const users: User[] = [
    {
      id: "1",
      name: "Mary Pat Uzoma",
      email: "admin@example.com",
      // This is not a real hash, just for demonstration
      password: "$2b$10$8OOV.q.RDWWkZA3fHW9jveGp4xPFU1KnCQmFg4lfHIR/SFULpEJLW", // "mawais123"
      bio: "Author of 'Misplaced Trust' and 'From the Eyes of a Baby'. Woman of faith, educator, and real estate investor.",
      image: "/assets/images/marypatpic.jpg",
    },
  ]
  
  const books: Book[] = [
    {
      id: "1",
      title: "Misplaced Trust and the Power of Forgiveness",
      description: "A story of heartbreak, betrayal, and forgiveness that shook the heavens.",
      image: "/assets/images/marry4.webp",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "From The Eyes Of A Baby",
      description: "Seeing the world through newborn eyes: A book that changes everything.",
      image: "/assets/images/from2.jpg",
      createdAt: new Date().toISOString(),
    },
  ]
  
  const blogs: Blog[] = [
    {
      id: "1",
      title: "Misplaced Trust and the Power of Forgiveness",
      summary: "One measure of Kindness, One Stranger, One Decision That Swap Everything",
      content:
        "In helping a person in need, how many risks or sacrifices would you undertake? Mary-Pat Uzoma didn't hesitate...",
      image: "/assets/images/1.jpg",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "From the Eyes of a Baby",
      summary: "Seeing the World Through Newborn Eyes: A Book That Changes Everything",
      content: "Have you ever asked yourself about the feelings of someone who encounters the world for the first time?",
      image: "/assets/images/2.jpg",
      createdAt: new Date().toISOString(),
    },
  ]
  
  const messages: Message[] = []
  
  // Mock database functions
  export const fallbackDb = {
    user: {
      findUnique: async ({ where }: { where: { email: string } }) => {
        return users.find((user) => user.email === where.email) || null
      },
      findFirst: async () => {
        return users[0] || null
      },
      create: async ({ data }: { data: Omit<User, "id"> }) => {
        const newUser = { ...data, id: String(users.length + 1) }
        users.push(newUser as User)
        return newUser
      },
      update: async ({ where, data }: { where: { id: string }; data: Partial<User> }) => {
        const index = users.findIndex((user) => user.id === where.id)
        if (index === -1) throw new Error("User not found")
        users[index] = { ...users[index], ...data }
        return users[index]
      },
    },
    book: {
      findMany: async () => {
        return books
      },
      findUnique: async ({ where }: { where: { id: string } }) => {
        return books.find((book) => book.id === where.id) || null
      },
      create: async ({ data }: { data: Omit<Book, "id" | "createdAt"> }) => {
        const newBook = {
          ...data,
          id: String(books.length + 1),
          createdAt: new Date().toISOString(),
        }
        books.push(newBook as Book)
        return newBook
      },
      update: async ({ where, data }: { where: { id: string }; data: Partial<Book> }) => {
        const index = books.findIndex((book) => book.id === where.id)
        if (index === -1) throw new Error("Book not found")
        books[index] = { ...books[index], ...data }
        return books[index]
      },
      delete: async ({ where }: { where: { id: string } }) => {
        const index = books.findIndex((book) => book.id === where.id)
        if (index === -1) throw new Error("Book not found")
        const deleted = books[index]
        books.splice(index, 1)
        return deleted
      },
    },
    blog: {
      findMany: async () => {
        return blogs
      },
      findUnique: async ({ where }: { where: { id: string } }) => {
        return blogs.find((blog) => blog.id === where.id) || null
      },
      create: async ({ data }: { data: Omit<Blog, "id" | "createdAt"> }) => {
        const newBlog = {
          ...data,
          id: String(blogs.length + 1),
          createdAt: new Date().toISOString(),
        }
        blogs.push(newBlog as Blog)
        return newBlog
      },
      update: async ({ where, data }: { where: { id: string }; data: Partial<Blog> }) => {
        const index = blogs.findIndex((blog) => blog.id === where.id)
        if (index === -1) throw new Error("Blog not found")
        blogs[index] = { ...blogs[index], ...data }
        return blogs[index]
      },
      delete: async ({ where }: { where: { id: string } }) => {
        const index = blogs.findIndex((blog) => blog.id === where.id)
        if (index === -1) throw new Error("Blog not found")
        const deleted = blogs[index]
        blogs.splice(index, 1)
        return deleted
      },
    },
    message: {
      findMany: async () => {
        return messages
      },
      findUnique: async ({ where }: { where: { id: string } }) => {
        return messages.find((message) => message.id === where.id) || null
      },
      create: async ({ data }: { data: Omit<Message, "id" | "createdAt"> }) => {
        const newMessage = {
          ...data,
          id: String(messages.length + 1),
          createdAt: new Date().toISOString(),
        }
        messages.push(newMessage as Message)
        return newMessage
      },
      delete: async ({ where }: { where: { id: string } }) => {
        const index = messages.findIndex((message) => message.id === where.id)
        if (index === -1) throw new Error("Message not found")
        const deleted = messages[index]
        messages.splice(index, 1)
        return deleted
      },
    },
  }
  