
/**
 * Take update input types
 * and validates and asserts its of correct type. 
 * @typedef {TodoInput} 
 * @property {number} id
 * @property {string} text
 * 
 * @property {number?} completed OPTIONAL
*/
export const validateTodoInput = ({ id, text, completed }) => {
    // TODO: instead of throwing return message and code, 
    // or some form structure so we can return and set error on correct field.
    // TODO: use zod
    if (typeof id !== 'number') {
      throw new Error("Invalid ID");
    }
  
    if (typeof text !== 'string' || text.trim() === "") {
      throw new Error("Invalid todo text");
    }
  
    if (completed !== undefined && typeof completed !== 'boolean') {
      throw new Error("Invalid completed value");
    }
  };