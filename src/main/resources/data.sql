TRUNCATE TABLE users;
-- Seed data for users table
INSERT INTO users (id, username, password, age, email, first_name, last_name) VALUES
                                                                                  ('550e8400-e29b-41d4-a716-446655440001', 'john_doe', '$2a$10$slYQmyNdGzin7olVN3p5be4nxQjV2d9dGvQGAlt28WjLdMZGd7rOG', 28, 'john.doe@example.com', 'John', 'Doe'),
                                                                                  ('550e8400-e29b-41d4-a716-446655440002', 'jane_smith', '$2a$10$slYQmyNdGzin7olVN3p5be4nxQjV2d9dGvQGAlt28WjLdMZGd7rOG', 34, 'jane.smith@example.com', 'Jane', 'Smith'),
                                                                                  ('550e8400-e29b-41d4-a716-446655440003', 'bob_wilson', '$2a$10$slYQmyNdGzin7olVN3p5be4nxQjV2d9dGvQGAlt28WjLdMZGd7rOG', 45, 'bob.wilson@example.com', 'Bob', 'Wilson'),
                                                                                  ('550e8400-e29b-41d4-a716-446655440004', 'alice_johnson', '$2a$10$slYQmyNdGzin7olVN3p5be4nxQjV2d9dGvQGAlt28WjLdMZGd7rOG', 31, 'alice.johnson@example.com', 'Alice', 'Johnson'),
                                                                                  ('550e8400-e29b-41d4-a716-446655440005', 'charlie_brown', '$2a$10$slYQmyNdGzin7olVN3p5be4nxQjV2d9dGvQGAlt28WjLdMZGd7rOG', 26, 'charlie.brown@example.com', 'Charlie', 'Brown');
