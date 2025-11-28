// Working C++ Star Pattern Code
// Copy this code and paste it in your editor

#include <iostream> 
using namespace std;

int main() {
    int rows;
    cout << "Enter the number of rows for the star pattern: ";
    cin >> rows;

    for (int i = 1; i <= rows; ++i) {
        for (int j = 1; j <= i; ++j) {
            cout << "* ";
        }
        cout << endl;
    }

    return 0;
}

/* 
EXPLANATION:
- This code creates a star pattern pyramid
- It asks user for number of rows
- For each row i, it prints i stars
- Example output for 5 rows:
  *
  * *
  * * *
  * * * *
  * * * * *
  
This code will work properly now with the direct C++ execution service!
*/