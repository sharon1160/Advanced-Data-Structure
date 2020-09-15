#include <iostream>
#include <time.h>

using namespace std;

int main(){
    int vector[1000000];
    int quantity = 1000000;
    srand(time(NULL));

    for(int i = 0; i < quantity; i++)
    {
        // vector[i] = 1 + rand() % ((quantity + 1 ) - 1); -- numbers within the range of 1 a 1000000
        vector[i] = 1 + rand() % (11 - 1); // -- numbers within the range of de 1 a 10
        cout << vector[i] << " ";
    }

    return 0;
}