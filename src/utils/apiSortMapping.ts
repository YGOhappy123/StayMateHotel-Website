const SORT_MAPPING = {
    '-createdAt': { createdAt: 'DESC' },
    '+createdAt': { createdAt: 'ASC' },
    '-price': { price: 'DESC' },
    '+price': { price: 'ASC' },
    '-basePrice': { basePrice: 'DESC' },
    '+basePrice': { basePrice: 'ASC' },
    '-totalAmount': { totalAmount: 'DESC' },
    '+totalAmount': { totalAmount: 'ASC' },
    '-paymentTime': { paymentTime: 'DESC' },
    '+paymentTime': { paymentTime: 'ASC' },
    '-amount': { amount: 'DESC' },
    '+amount': { amount: 'ASC' }
}

const getMappedSort = (sort: string) => {
    return SORT_MAPPING[sort as keyof typeof SORT_MAPPING] ?? {}
}

export { SORT_MAPPING, getMappedSort }
